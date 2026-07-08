/**
 * Unified Schema for Artwork Metadata
 * 
 * This schema serves as the single source of truth for artwork data across different museum APIs.
 * All incoming data from various sources will be normalized to match this structure.
 * 
 * @typedef {Object} UnifiedMetadataSchema
 */
export const UNIFIED_SCHEMA = {
  // Core identification
  id: String,                    // Unique identifier for the artwork
  title: String,                 // Primary title of the artwork
  alternativeTitles: [String],   // Other known titles
  
  // Creator information
  creators: [{
    name: String,                // Full name of the creator
    role: String,                // e.g., "artist", "designer", "sculptor"
    birthYear: Number,           // Year of birth (if known)
    deathYear: Number,           // Year of death (if known)
    nationality: String,         // Creator's nationality
    biography: String            // Brief biographical information
  }],

  // Dating and historical context
  dateCreated: {
    earliest: Number,            // Earliest possible creation date
    latest: Number,              // Latest possible creation date
    display: String             // Formatted date string for display
  },

  // Physical characteristics
  materials: [{
    medium: String,              // Primary material or technique
    support: String,             // Secondary material (if applicable)
    details: String              // Additional material information
  }],
  
  dimensions: {
    height: Number,
    width: Number,
    depth: Number,
    diameter: Number,            // For circular works
    weight: Number,              // For sculptures and installations
    unit: String,                // e.g., "cm", "inches"
    displayText: String          // Formatted dimensions for display
  },

  // Classification and style
  classification: String,        // e.g., "painting", "sculpture", "photograph"
  style: String,                // Artistic style or movement
  period: String,               // Historical period
  culture: String,              // Cultural context

  // Visual documentation
  images: [{
    url: String,                 // URL to the image
    type: String,                // e.g., "primary", "detail", "alternate"
    altText: String,             // Descriptive text for accessibility
    copyright: String,           // Copyright information
    quality: String              // e.g., "high-res", "thumbnail"
  }],

  // Provenance and location
  currentLocation: {
    institution: String,         // Museum or collection name
    gallery: String,             // Specific gallery or room
    accessionNumber: String,     // Institution's reference number
    onDisplay: Boolean           // Whether currently viewable by public
  },

  // Additional metadata
  description: String,           // Detailed description of the artwork
  exhibitions: [{
    title: String,               // Exhibition name
    startDate: String,           // Start date
    endDate: String,             // End date
    institution: String          // Host institution
  }],
  
  // Technical metadata
  lastModified: String,         // Timestamp of last data update
  source: {
    institution: String,         // Source institution of the data
    apiEndpoint: String,         // API endpoint where data was retrieved
    lastFetched: String         // Timestamp of last API fetch
  }
};

/**
 * Development-only tripwire that pins the *structural* contract every normalizer
 * must satisfy. It checks shape (keys present, arrays are arrays), not values —
 * a null title or an imageless record is legitimate and passes; a normalizer
 * that emits the wrong shape (e.g. a flat `imageUrl` string instead of an
 * `images` array) throws the moment it runs. Call it on the object each
 * normalizer returns. No-op in production.
 *
 * @param {Object} artwork - The normalized artwork object
 * @param {string} sourceLabel - Which normalizer produced it (for the error)
 * @returns {Object} The same artwork, so callers can `return assertArtworkShape(obj, 'x')`
 */
export function assertArtworkShape(artwork, sourceLabel = 'unknown') {
  if (process.env.NODE_ENV === 'production') return artwork;

  const problems = [];
  if (!artwork || typeof artwork !== 'object') {
    problems.push('normalized artwork is not an object');
  } else {
    if (!('id' in artwork)) problems.push('missing "id" key');
    if (!('title' in artwork)) problems.push('missing "title" key');
    if (!Array.isArray(artwork.images)) problems.push('"images" must be an array');
    if (!Array.isArray(artwork.creators)) problems.push('"creators" must be an array');
  }

  if (problems.length > 0) {
    throw new Error(
      `[artwork-shape] ${sourceLabel} normalizer violates the unified shape: ${problems.join('; ')}`
    );
  }
  return artwork;
}

/**
 * Example of normalized data structure:
 * 
 * {
 *   id: "met_123456",
 *   title: "The Starry Night",
 *   creators: [{
 *     name: "Vincent van Gogh",
 *     role: "artist",
 *     birthYear: 1853,
 *     deathYear: 1890,
 *     nationality: "Dutch"
 *   }],
 *   dateCreated: {
 *     earliest: 1889,
 *     latest: 1889,
 *     display: "June 1889"
 *   }
 *   // ... other fields following the schema above
 * }
 */ 