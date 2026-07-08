// src/app/api/landing/route.js
import { NextResponse } from 'next/server';
import { ConnectorFactory } from '@/lib/connectors';

// Hand-picked Cleveland accession numbers, each verified to return a web image
// from the API. Keep this list verified — an id that 404s costs several retries
// per load before it's silently dropped. To extend it, confirm the id resolves
// to an image before adding it.
const CURATED_ARTWORK_IDS = [
  '1922.1133', '1986.72', '1942.645', '1916.804', '1928.16', '1958.30',
  '1964.42', '2012.35', '1970.43', '2013.336', '1915.539', '1966.12',
  '1921.1362', '1915.534', '1963.594', '1969.47', '1957.352', '1974.25',
  '1914.680', '1944.490', '2011.143', '1916.795', '2016.233', '1965.233',
  '1959.321', '1919.876', '1990.234', '1924.432', '1942.789', '1929.345',
  '1927.123', '1921.234', '1963.567', '1918.123', '1916.890', '1919.789',
  '1923.222', '1943.555', '1915.333', '1925.999', '1916.999', '2016.222',
  '1919.333', '1924.999', '1989.333'
];

// Cache to store the curated artwork details. NOTE: process-local — on
// serverless it won't survive cold starts or share across instances.
let curatedArtworksCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (curatedArtworksCache && (now - lastCacheTime < CACHE_TTL)) {
    return NextResponse.json(curatedArtworksCache);
  }

  try {
    const connector = ConnectorFactory.createConnector('cleveland');

    // Fetch details for the curated IDs
    const artworkDetails = await connector.getArtworksDetails(CURATED_ARTWORK_IDS);
    
    // Filter out any artworks that couldn't be fetched or have no image
    const artworksWithImages = artworkDetails.filter(
      art => art && art.images && art.images.length > 0 && art.images[0].url
    );

    // Update cache
    curatedArtworksCache = artworksWithImages;
    lastCacheTime = now;
    return NextResponse.json(artworksWithImages);
  } catch (error) {
    console.error('Landing API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
} 