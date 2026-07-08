import { assertArtworkShape } from './schema';

/**
 * Normalizes artwork data from the Cleveland Museum of Art API to match our unified schema.
 *
 * @param {Object} item - Raw artwork data from Cleveland API
 * @returns {Object} Normalized artwork data matching the unified schema
 */
export function normalizeClevelandData(item) {
  if (!item) return null;

  // Helper function to safely access nested properties
  const get = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Helper function to safely get first item from array or return null
  const getFirst = (arr) => Array.isArray(arr) && arr.length > 0 ? arr[0] : null;

  // Extract creator information
  const primaryCreator = getFirst(item.creators);
  const creator = primaryCreator ? {
    name: primaryCreator.description || null,
    role: primaryCreator.role || 'artist',
    birthYear: primaryCreator.birth_year || null,
    deathYear: primaryCreator.death_year || null,
    nationality: primaryCreator.nationality || null,
    biography: null // Cleveland API doesn't provide this
  } : null;

  // Extract date information
  const dateCreated = {
    earliest: item.creation_date_earliest || null,
    latest: item.creation_date_latest || null,
    display: item.creation_date || null
  };

  // Extract dimension information
  const dimensions = {
    height: get(item, 'measurements.height') || null,
    width: get(item, 'measurements.width') || null,
    depth: get(item, 'measurements.depth') || null,
    diameter: get(item, 'measurements.diameter') || null,
    weight: null, // Cleveland API doesn't typically provide this
    unit: get(item, 'measurements.unit') || 'cm',
    displayText: item.measurements_display || null
  };

  // Extract primary image
  const primaryImage = get(item, 'images.web');
  const image = primaryImage ? {
    url: primaryImage.url || null,
    type: 'primary',
    altText: item.title || 'Artwork image',
    copyright: item.copyright || null,
    quality: 'web'
  } : null;

  // Build normalized object following the unified schema
  return assertArtworkShape({
    id: item.id?.toString() || null,
    title: item.title || null,
    alternativeTitles: item.alternate_titles || [],
    
    creators: creator ? [creator] : [],

    dateCreated,

    materials: [{
      medium: item.technique || null,
      support: null, // Cleveland API doesn't typically provide this
      details: item.materials || null
    }],

    dimensions,

    classification: item.type || null,
    style: item.style || null,
    period: item.period || null,
    culture: item.culture || null,

    images: image ? [image] : [],

    currentLocation: {
      institution: 'Cleveland Museum of Art',
      gallery: item.gallery || null,
      accessionNumber: item.accession_number || null,
      onDisplay: item.is_on_view || false
    },

    description: item.wall_description || item.description || null,
    
    exhibitions: [], // Would need additional API call to get exhibition history

    lastModified: item.updated_at || null,
    source: {
      institution: 'Cleveland Museum of Art',
      apiEndpoint: 'https://openaccess-api.clevelandart.org/api/artworks/',
      lastFetched: new Date().toISOString()
    }
  }, 'cleveland');
} 