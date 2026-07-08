export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ConnectorFactory } from '@/lib/connectors';

const DEFAULT_PER_PAGE = 48; // Reduced for faster initial loads
const MAX_PER_PAGE = 96;

const searchIdCache = new Map();
const SEARCH_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function getAndCacheSearchIds(query, connectors, searchContext = {}) {
  const cacheKey = query.toLowerCase().trim();
  const cached = searchIdCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < SEARCH_CACHE_TTL) && !searchContext.isRelatedSearch) {
    return cached.ids;
  }

  const idPromises = connectors.map(connector =>
    connector.search(query, 1, DEFAULT_PER_PAGE, searchContext).then(ids => ({
      source: connector.name,
      ids: ids || []
    }))
  );

  const idResults = await Promise.all(idPromises);
  const idMap = new Map();

  idResults.forEach(result => {
    result.ids.forEach(id => {
      if (!idMap.has(id)) {
        idMap.set(id, result.source);
      }
    });
  });

  const allIds = Array.from(idMap.entries()).map(([id, source]) => ({ id, source }));
  searchIdCache.set(cacheKey, { timestamp: Date.now(), ids: allIds });
  return allIds;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE), MAX_PER_PAGE);

    if (!query || page < 1) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Parse search context if provided
    let searchContext = {};
    const contextParam = searchParams.get('context');
    if (contextParam) {
      try {
        searchContext = JSON.parse(decodeURIComponent(contextParam));
      } catch (error) {
        console.error('Failed to parse search context:', error);
      }
    }

    const connectors = ConnectorFactory.getActiveConnectors();
    const allIds = await getAndCacheSearchIds(query, connectors, searchContext);
    const totalResults = allIds.length;

    const startIndex = (page - 1) * perPage;
    const pageIds = allIds.slice(startIndex, startIndex + perPage);

    if (pageIds.length === 0) {
      return NextResponse.json({
        data: [],
        pagination: { currentPage: page, perPage, totalResults, totalPages: Math.ceil(totalResults / perPage), hasMore: false }
      });
    }

    const idsBySource = pageIds.reduce((acc, item) => {
      acc[item.source] = acc[item.source] || [];
      acc[item.source].push(item.id);
      return acc;
    }, {});

    const detailPromises = connectors.map(async connector => {
      const ids = idsBySource[connector.name];
      if (!ids || ids.length === 0) return [];
      return connector.getArtworksDetails(ids);
    });

    const artworkBatches = await Promise.all(detailPromises);
    const allArtworks = artworkBatches.flat().filter(Boolean);

    // Filter out artworks without images before sending to client
    const artworksWithImages = allArtworks.filter(art => art && art.images && art.images.length > 0 && art.images[0].url);

    return NextResponse.json({
      data: artworksWithImages,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalResults: totalResults,
        totalPages: Math.ceil(totalResults / perPage),
        hasMore: startIndex + perPage < totalResults
      }
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
} 