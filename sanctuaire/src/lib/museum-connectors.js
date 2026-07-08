/**
 * Museum API Connectors
 * 
 * This file demonstrates the scalable connector pattern for integrating multiple museum APIs.
 * Each connector knows how to:
 * 1. Authenticate with its specific API
 * 2. Format queries for that API
 * 3. Handle its specific pagination logic
 * 4. Normalize the data into a consistent format
 */

import { normalizeClevelandData } from './normalizer';

/**
 * Base Connector Interface
 * All museum connectors should implement these methods
 */
class BaseConnector {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  async search(query, page, perPage, searchContext = {}) {
    throw new Error('search method must be implemented');
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
  }

  async search(query, page, perPage, searchContext = {}) {
    try {
      const skip = (page - 1) * perPage;
      
      const apiParams = new URLSearchParams({
        q: query,
        limit: perPage.toString(),
        skip: skip.toString()
      });

      // Cleveland API specific enhancements for related searches
      if (searchContext.isRelatedSearch && searchContext.sourceArtwork) {
        this.enhanceQueryForRelatedSearch(apiParams, query, searchContext.sourceArtwork);
      }

      const response = await fetch(`${this.baseUrl}?${apiParams.toString()}`, {
        headers: { 
          'Accept': 'application/json',
          ...this.buildAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Cleveland API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        artworks: data.data || [],
        totalResults: data.info?.total || 0,
        source: this.name
      };
    } catch (error) {
      console.error(`${this.name} connector error:`, error);
      return { artworks: [], totalResults: 0, source: this.name };
    }
  }

  enhanceQueryForRelatedSearch(params, query, sourceArtwork) {
    if (sourceArtwork.artist) {
      params.append('artists', sourceArtwork.artist);
    }
    if (sourceArtwork.culture) {
      params.append('culture', sourceArtwork.culture);
    }
    if (sourceArtwork.classification) {
      params.append('type', sourceArtwork.classification);
    }
  }

  normalizeArtwork(artwork) {
    return normalizeClevelandData(artwork);
  }
}

/**
 * Art Institute of Chicago Connector
 * Demonstrates how to add another museum API
 */
export class ArticConnector extends BaseConnector {
  constructor() {
    super('artic', 'https://api.artic.edu/api/v1/artworks');
  }

  async search(query, page, perPage, searchContext = {}) {
    try {
      // Art Institute uses different pagination (from/size instead of skip/limit)
      const from = (page - 1) * perPage;
      
      // Build the search request for Art Institute's Elasticsearch API
      const searchBody = {
        q: query,
        from: from,
        size: perPage,
        fields: 'id,title,artist_display,date_display,medium_display,place_of_origin,image_id,thumbnail'
      };

      // Art Institute specific enhancements for related searches
      if (searchContext.isRelatedSearch && searchContext.sourceArtwork) {
        this.enhanceQueryForRelatedSearch(searchBody, query, searchContext.sourceArtwork);
      }

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
      return {
        artworks: data.data || [],
        totalResults: data.pagination?.total || 0,
        source: this.name
      };
    } catch (error) {
      console.error(`${this.name} connector error:`, error);
      return { artworks: [], totalResults: 0, source: this.name };
    }
  }

  enhanceQueryForRelatedSearch(searchBody, query, sourceArtwork) {
    // Art Institute uses Elasticsearch query DSL
    if (sourceArtwork.artist || sourceArtwork.culture || sourceArtwork.classification) {
      searchBody.query = {
        bool: {
          must: [
            { multi_match: { query: query, fields: ['title', 'artist_display', 'medium_display'] } }
          ],
          should: []
        }
      };

      if (sourceArtwork.artist) {
        searchBody.query.bool.should.push({
          match: { artist_display: sourceArtwork.artist }
        });
      }

      if (sourceArtwork.culture) {
        searchBody.query.bool.should.push({
          match: { place_of_origin: sourceArtwork.culture }
        });
      }

      if (sourceArtwork.classification) {
        searchBody.query.bool.should.push({
          match: { artwork_type_title: sourceArtwork.classification }
        });
      }
    }
  }

  normalizeArtwork(artwork) {
    // Normalize Art Institute data to our standard format
    return {
      id: artwork.id,
      title: artwork.title || 'Untitled',
      creators: artwork.artist_display ? [{ name: artwork.artist_display }] : [],
      culture: artwork.place_of_origin || null,
      classification: artwork.artwork_type_title || null,
      date: artwork.date_display || null,
      medium: artwork.medium_display || null,
      description: artwork.description || null,
      imageUrl: artwork.image_id ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` : null,
      thumbnail: artwork.thumbnail || null,
      url: `https://www.artic.edu/artworks/${artwork.id}`,
      source: this.name
    };
  }
}

/**
 * Metropolitan Museum Connector (Example)
 * Shows how you'd add the Met's API
 */
export class MetConnector extends BaseConnector {
  constructor() {
    super('met', 'https://collectionapi.metmuseum.org/public/collection/v1');
  }

  async search(query, page, perPage, searchContext = {}) {
    try {
      // Met API requires a two-step process: search, then get object details
      // Step 1: Search for object IDs
      const searchResponse = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        headers: this.buildAuthHeaders()
      });

      if (!searchResponse.ok) {
        throw new Error(`Met API search error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const objectIDs = searchData.objectIDs || [];

      // Step 2: Paginate through the object IDs
      const start = (page - 1) * perPage;
      const end = Math.min(start + perPage, objectIDs.length);
      const pageObjectIDs = objectIDs.slice(start, end);

      // Step 3: Get detailed info for each object
      const artworks = await Promise.all(
        pageObjectIDs.map(async (id) => {
          try {
            const response = await fetch(`${this.baseUrl}/objects/${id}`, {
              headers: this.buildAuthHeaders()
            });
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (error) {
            console.error(`Error fetching Met object ${id}:`, error);
            return null;
          }
        })
      );

      return {
        artworks: artworks.filter(artwork => artwork !== null),
        totalResults: objectIDs.length,
        source: this.name
      };
    } catch (error) {
      console.error(`${this.name} connector error:`, error);
      return { artworks: [], totalResults: 0, source: this.name };
    }
  }

  enhanceQueryForRelatedSearch(searchParams, query, sourceArtwork) {
    // Met API enhancement logic would go here
    // This could involve additional API calls or query modifications
  }

  normalizeArtwork(artwork) {
    // Normalize Met data to our standard format
    return {
      id: artwork.objectID,
      title: artwork.title || 'Untitled',
      creators: artwork.artistDisplayName ? [{ name: artwork.artistDisplayName }] : [],
      culture: artwork.culture || null,
      classification: artwork.objectName || null,
      date: artwork.objectDate || null,
      medium: artwork.medium || null,
      description: artwork.objectWikidata_URL || null,
      imageUrl: artwork.primaryImageSmall || null,
      thumbnail: { url: artwork.primaryImageSmall, width: 200, height: 200 },
      url: artwork.objectURL || `https://www.metmuseum.org/art/collection/search/${artwork.objectID}`,
      source: this.name
    };
  }
}

/**
 * Connector Factory
 * Manages all available connectors
 */
export class ConnectorFactory {
  static connectors = {
    cleveland: ClevelandConnector,
    artic: ArticConnector,
    met: MetConnector
  };

  static createConnector(name) {
    const ConnectorClass = this.connectors[name];
    if (!ConnectorClass) {
      throw new Error(`Unknown connector: ${name}`);
    }
    return new ConnectorClass();
  }

  static getAllConnectors() {
    return Object.keys(this.connectors).map(name => this.createConnector(name));
  }

  static getActiveConnectors() {
    // In the future, you could have configuration to enable/disable certain museums
    // For now, only return Cleveland since it's the only one implemented
    return ['cleveland'].map(name => this.createConnector(name));
  }
}

/**
 * Usage example in your API route:
 * 
 * const connectors = ConnectorFactory.getActiveConnectors();
 * const searchPromises = connectors.map(connector => 
 *   connector.search(query, page, perPage, searchContext)
 * );
 * const results = await Promise.all(searchPromises);
 * 
 * // Then aggregate and rank the results across all sources
 */ 