import { assertArtworkShape } from './schema';

/**
 * Normalizes artwork data from the Art Institute of Chicago API to match our unified schema.
 *
 * @param {Object} item - Raw artwork data from AIC API
 * @returns {Object} Normalized artwork data matching the unified schema
 */
export function normalizeArticData(item) {
  if (!item) return null;

  // Helper function to safely access nested properties
  const get = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Extract creator information
  const creator = item.artist_display ? {
    name: item.artist_display,
    role: 'artist',
    birthYear: null, // AIC API doesn't provide this directly
    deathYear: null, // AIC API doesn't provide this directly
    nationality: null, // AIC API doesn't provide this directly
    biography: null
  } : null;

  // Extract date information
  const dateCreated = {
    earliest: item.date_start || null,
    latest: item.date_end || null,
    display: item.date_display || null
  };

  // Extract dimension information
  const dimensions = {
    height: item.dimensions?.height || null,
    width: item.dimensions?.width || null,
    depth: item.dimensions?.depth || null,
    diameter: null, // AIC API doesn't typically provide this
    weight: null,
    unit: 'cm', // AIC typically uses metric
    displayText: item.dimensions_detail || null
  };

  // Extract primary image
  const image = item.image_id ? {
    url: `https://www.artic.edu/iiif/2/${item.image_id}/full/max/0/default.jpg`,
    type: 'primary',
    altText: item.title || 'Artwork image',
    copyright: item.copyright_notice || null,
    quality: 'web'
  } : null;

  // Build normalized object following the unified schema
  return assertArtworkShape({
    id: item.id?.toString() || null,
    title: item.title || null,
    alternativeTitles: [], // AIC API doesn't typically provide this
    
    creators: creator ? [creator] : [],

    dateCreated,

    materials: [{
      medium: item.medium_display || null,
      support: null,
      details: item.material_titles?.join(', ') || null
    }],

    dimensions,

    classification: item.artwork_type_title || null,
    style: item.style_title || null,
    period: item.category_titles?.[0] || null,
    culture: item.place_of_origin || null,

    images: image ? [image] : [],

    currentLocation: {
      institution: 'Art Institute of Chicago',
      gallery: item.gallery_title || null,
      accessionNumber: item.main_reference_number || null,
      onDisplay: item.is_on_view || false
    },

    description: item.description || null,
    
    exhibitions: [], // Would need additional API call to get exhibition history

    lastModified: item.timestamp || null,
    source: {
      institution: 'Art Institute of Chicago',
      apiEndpoint: 'https://api.artic.edu/api/v1/artworks/',
      lastFetched: new Date().toISOString()
    }
  }, 'artic');
} 