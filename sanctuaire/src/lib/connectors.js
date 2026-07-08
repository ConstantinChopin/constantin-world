import { normalizeClevelandData } from './normalizer';
import { normalizeArticData } from './artic-normalizer';

/**
 * Strips a Cleveland-style creator string down to a plain name so it works as a
 * keyword. "Claude Monet (French, 1840-1926)" -> "Claude Monet".
 */
function cleanArtistName(name) {
  return name ? name.replace(/\s*\(.*$/, '').trim() : '';
}

/**
 * Derives the query text for a "related" search from the artwork the user
 * clicked. Both museum APIs treat `q` as full-text relevance, so we bias the
 * search toward the strongest available signals (artist, then culture, then
 * classification) as extra terms rather than as hard filters — hard filters
 * over-constrain and routinely return nothing. Falls back to the original
 * query when the source artwork carries no usable metadata.
 */
export function buildEffectiveQuery(query, searchContext = {}) {
  if (!searchContext.isRelatedSearch || !searchContext.sourceArtwork) return query;
  const { artist, culture, classification } = searchContext.sourceArtwork;
  // Some source fields (e.g. Cleveland's culture) arrive as arrays — flatten to
  // space-joined text rather than relying on implicit comma stringification.
  const toText = (v) => (Array.isArray(v) ? v.join(' ') : v || '');
  const terms = [cleanArtistName(artist), toText(culture), toText(classification)].filter(Boolean);
  return terms.length > 0 ? terms.join(' ') : query;
}

/**
 * Base Connector Interface
 * All museum connectors should implement these methods
 */
class BaseConnector {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  async search(query, searchContext = {}) {
    throw new Error('search method must be implemented');
  }

  async getArtworksDetails(ids) {
    throw new Error('getArtworksDetails method must be implemented');
  }

  normalizeArtwork(artwork) {
    throw new Error('normalizeArtwork method must be implemented');
  }

  buildAuthHeaders() {
    // Override in child classes if authentication is needed
    return {};
  }
}

/**
 * Cleveland Museum of Art Connector
 */
export class ClevelandConnector extends BaseConnector {
  constructor() {
    super('cleveland', 'https://openaccess-api.clevelandart.org/api/artworks');
    this.maxConcurrentRequests = 10; // Limit concurrent network requests
    this.detailCache = new Map();    // In-memory cache for artwork details
    this.cacheTimeout = 30 * 60 * 1000; // 30-minute cache TTL
  }

  async getArtworksDetails(ids) {
    try {
      if (!ids || ids.length === 0) return [];

      const results = [];
      const uncachedIds = [];

      // First, check the cache for existing artwork details
      for (const id of ids) {
        const cached = this.getCachedArtwork(id);
        if (cached) {
          results.push(cached);
        } else {
          uncachedIds.push(id);
        }
      }

      if (uncachedIds.length === 0) {
        return results;
      }

      // Create batches of IDs to fetch concurrently
      const batches = this.createBatches(uncachedIds, this.maxConcurrentRequests);

      for (const batch of batches) {
        const batchResults = await Promise.all(
          batch.map(id => this.fetchArtworkWithRetry(id))
        );
        results.push(...batchResults.filter(Boolean));
      }

      return results;
    } catch (error) {
      console.error(`${this.name} getArtworksDetails error:`, error);
      return [];
    }
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  async fetchArtworkWithRetry(id, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(`${this.baseUrl}/${id}`, {
          headers: { 'Accept': 'application/json', ...this.buildAuthHeaders() },
          signal: AbortSignal.timeout(8000) // 8-second timeout
        });

        if (!response.ok) {
          if (i === retries) return null;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
          continue;
        }

        const data = await response.json();
        const normalized = this.normalizeArtwork(data.data);
        this.cacheArtwork(id, normalized); // Cache the successful result
        return normalized;
      } catch (error) {
        if (i === retries) {
          console.error(`Failed to fetch artwork ${id} after ${retries + 1} attempts:`, error);
          return null;
        }
      }
    }
  }

  cacheArtwork(id, artwork) {
    this.detailCache.set(id, {
      artwork,
      timestamp: Date.now()
    });
  }

  getCachedArtwork(id) {
    const cached = this.detailCache.get(id);
    if (!cached || (Date.now() - cached.timestamp > this.cacheTimeout)) {
      if (cached) this.detailCache.delete(id);
      return null;
    }
    return cached.artwork;
  }

  async search(query, searchContext = {}) {
    try {
      // NOTE: capped at 100 ids per query — Cleveland's real total (data.info.total)
      // is discarded, so results can never exceed this. Fine for now; revisit with
      // real cursor pagination if deeper result sets are needed.
      const apiParams = new URLSearchParams({
        q: buildEffectiveQuery(query, searchContext),
        limit: '100',
        fields: 'id'
      });
      const response = await fetch(`${this.baseUrl}?${apiParams.toString()}`, {
        headers: { 'Accept': 'application/json', ...this.buildAuthHeaders() }
      });
      if (!response.ok) throw new Error(`Cleveland API error: ${response.status}`);
      const data = await response.json();
      return data.data?.map(item => item.id) || [];
    } catch (error) {
      console.error(`${this.name} search error:`, error);
      return [];
    }
  }

  normalizeArtwork(artwork) {
    return normalizeClevelandData(artwork);
  }
}

/**
 * Art Institute of Chicago Connector
 */
export class ArticConnector extends BaseConnector {
  constructor() {
    super('artic', 'https://api.artic.edu/api/v1/artworks');
  }

  async search(query, searchContext = {}) {
    try {
      // Build the search request body for IDs only
      const searchBody = {
        q: buildEffectiveQuery(query, searchContext),
        limit: 100, // Get maximum allowed per request
        fields: ['id'], // Only request IDs
        query: {
          bool: {
            must: [
              { term: { is_public_domain: true } },
              { exists: { field: 'image_id' } }
            ]
          }
        }
      };

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...this.buildAuthHeaders()
        },
        body: JSON.stringify(searchBody)
      });

      if (!response.ok) {
        throw new Error(`Art Institute API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.map(item => item.id) || [];
    } catch (error) {
      console.error(`${this.name} search error:`, error);
      return [];
    }
  }

  async getArtworksDetails(ids) {
    try {
      if (!ids.length) return [];
      
      // Fetch full artwork details for the given IDs
      const idsParam = ids.join(',');
      const fields = [
        'id',
        'title',
        'image_id',
        'artist_display',
        'date_display',
        'medium_display',
        'dimensions',
        'artwork_type_title',
        'department_title',
        'is_public_domain',
        'thumbnail'
      ].join(',');

      const response = await fetch(
        `${this.baseUrl}?ids=${idsParam}&limit=${ids.length}&fields=${fields}`, 
        {
          headers: {
            'Accept': 'application/json',
            ...this.buildAuthHeaders()
          }
        }
      );

      if (!response.ok) {
        console.error(`Art Institute API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      // Ensure we have a data array before mapping
      if (!data.data || !Array.isArray(data.data)) {
        console.error('Invalid response format from Art Institute API:', data);
        return [];
      }

      // Map and normalize the artworks, filtering out any that failed to normalize
      return data.data
        .map(artwork => {
          try {
            return this.normalizeArtwork(artwork);
          } catch (error) {
            console.error(`Failed to normalize artwork ${artwork.id}:`, error);
            return null;
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.error(`${this.name} getArtworksDetails error:`, error);
      return [];
    }
  }

  normalizeArtwork(artwork) {
    return normalizeArticData(artwork);
  }
}

/**
 * Factory for creating and managing museum API connectors
 */
export class ConnectorFactory {
  static connectors = {
    cleveland: ClevelandConnector,
    artic: ArticConnector
  };

  static createConnector(name) {
    const ConnectorClass = this.connectors[name];
    if (!ConnectorClass) {
      throw new Error(`No connector found for museum: ${name}`);
    }
    return new ConnectorClass();
  }

  static getAllConnectors() {
    return Object.keys(this.connectors);
  }

  static getActiveConnectors() {
    return Object.keys(this.connectors).map(name => this.createConnector(name));
  }
} 