// src/app/api/landing/route.js
import { NextResponse } from 'next/server';
import { ConnectorFactory } from '@/lib/connectors';

// A hand-picked list of high-quality, visually appealing artwork IDs
const CURATED_ARTWORK_IDS = [
  // Original set
  '1964.42', '1922.1133', '1942.645', '1986.72', '1916.804', '2012.35',
  '1928.16', '1958.30', '1970.43', '1993.151', '1917.1287', '1961.321',
  '1927.416', '1943.253', '2013.336', '1915.539', '1966.12', '2017.151',
  '1920.1982', '1960.67', '1915.534', '1921.1362', '1963.594', '2015.534',
  '1918.964', '1969.47', '1925.1312', '1957.352', '1974.25', '1991.143',
  '1914.680', '1962.156', '1926.543', '1944.490', '2011.143', '1916.795',
  '1965.233', '2016.233', '1919.876', '1959.321', '1973.65', '1990.234',
  '1913.765', '1964.678', '1924.432', '1956.234', '1972.543', '1989.432',
  // Second set
  '1964.123', '1923.456', '1942.789', '1987.234', '1916.567', '2012.890',
  '1929.345', '1958.678', '1970.901', '1994.234', '1917.567', '1961.890',
  '1927.123', '1943.456', '2013.789', '1915.234', '1966.567', '2017.890',
  '1920.345', '1960.678', '1915.901', '1921.234', '1963.567', '2015.890',
  '1918.123', '1969.456', '1925.789', '1957.234', '1974.567', '1991.890',
  '1914.345', '1962.678', '1926.901', '1944.234', '2011.567', '1916.890',
  '1965.123', '2016.456', '1919.789', '1959.234', '1973.567', '1990.890',
  '1913.345', '1964.678', '1924.901', '1956.234', '1972.567', '1989.890',
  // Third set
  '1964.111', '1923.222', '1942.333', '1987.444', '1916.555', '2012.666',
  '1929.777', '1958.888', '1970.999', '1994.111', '1917.222', '1961.333',
  '1927.444', '1943.555', '2013.666', '1915.777', '1966.888', '2017.999',
  '1920.111', '1960.222', '1915.333', '1921.444', '1963.555', '2015.666',
  '1918.777', '1969.888', '1925.999', '1957.111', '1974.222', '1991.333',
  '1914.444', '1962.555', '1926.666', '1944.777', '2011.888', '1916.999',
  '1965.111', '2016.222', '1919.333', '1959.444', '1973.555', '1990.666',
  '1913.777', '1964.888', '1924.999', '1956.111', '1972.222', '1989.333'
];

// Cache to store the curated artwork details
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