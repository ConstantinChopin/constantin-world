import { ConnectorFactory } from './museum-connectors';

// Keywords to fetch diverse artworks
const DIVERSE_QUERIES = [
  'portrait',
  'landscape',
  'abstract',
  'sculpture',
  'modern',
  'ancient',
  'photography',
  'painting'
];

// Determine if an artwork should be displayed as large based on its properties
function shouldBeLarge(artwork, index) {
  // For now, make every third artwork large
  // Later we can make this smarter based on image quality, aspect ratio, etc.
  return index % 3 === 0;
}

// Shuffle array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchLandingArtworks() {
  try {
    console.log('Starting to fetch landing artworks...');
    const connectors = ConnectorFactory.getAllConnectors();
    console.log(`Got ${connectors.length} connectors:`, connectors.map(c => c.name));
    
    const artworksPromises = [];

    // Fetch artworks using different queries to ensure variety
    for (const connector of connectors) {
      console.log(`Fetching from connector: ${connector.name}`);
      // Get 2 random queries for each connector
      const randomQueries = shuffleArray([...DIVERSE_QUERIES])
        .slice(0, 2);
      
      for (const query of randomQueries) {
        const promise = connector.search(query, 1, 32)
          .then(result => {
            console.log(`Got ${result.artworks.length} artworks from ${connector.name} for query "${query}"`);
            return result.artworks.map(artwork => ({
              ...artwork,
              originalQuery: query
            }));
          })
          .catch(error => {
            console.error(`Error fetching from ${connector.name} with query "${query}":`, error);
            return [];
          });
        
        artworksPromises.push(promise);
      }
    }

    let allArtworks = (await Promise.all(artworksPromises))
      .flat()
      // Filter out artworks without images
      .filter(artwork => {
        const hasImages = artwork.images && artwork.images.length > 0;
        if (!hasImages) {
          console.log('Filtering out artwork without images:', artwork.title);
        }
        return hasImages;
      });

    console.log(`Total artworks before shuffle: ${allArtworks.length}`);

    // Shuffle all artworks to mix different sources and queries
    allArtworks = shuffleArray(allArtworks);

    // Limit to 48 artworks and assign sizes
    const finalArtworks = allArtworks
      .slice(0, 48)
      .map((artwork, index) => ({
        ...artwork,
        size: shouldBeLarge(artwork, index) ? 'large' : 'regular'
      }));

    console.log(`Final number of artworks: ${finalArtworks.length}`);
    return finalArtworks;

  } catch (error) {
    console.error('Error in fetchLandingArtworks:', error);
    return [];
  }
}