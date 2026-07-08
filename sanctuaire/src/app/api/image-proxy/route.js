export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const ALLOWED_DOMAINS = [
  'artic.edu',
  'openaccess-cdn.clevelandart.org'
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0) {
      console.log(`Retrying fetch for ${url}, ${retries} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch after error for ${url}, ${retries} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function GET(request) {
  try {
    // Get the imageUrl from the query parameters
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return new NextResponse('Missing imageUrl parameter', { status: 400 });
    }

    // Validate the URL is from an allowed domain
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => imageUrl.includes(domain));
    if (!isAllowedDomain) {
      return new NextResponse('Invalid image source', { status: 403 });
    }

    // Determine appropriate headers based on the source
    const headers = {
      // Common headers for all requests
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/webp,image/avif,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'DNT': '1',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'Upgrade-Insecure-Requests': '1'
    };

    // Add source-specific headers
    if (imageUrl.includes('artic.edu')) {
      headers['Referer'] = 'https://www.artic.edu/';
    } else if (imageUrl.includes('clevelandart.org')) {
      headers['Referer'] = 'https://www.clevelandart.org/';
    }

    // Fetch the image with retry logic
    const response = await fetchWithRetry(imageUrl, { headers });

    if (!response.ok) {
      console.error(`Failed to fetch image after retries: ${response.status} ${response.statusText}`);
      
      // Check if the response is text/plain (error message)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/plain')) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return new NextResponse(
          `Failed to load image: ${errorText}`,
          { status: response.status }
        );
      }
      
      return new NextResponse(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
        { status: response.status }
      );
    }

    // Validate content type is an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`Invalid content type: ${contentType} for ${imageUrl}`);
      return new NextResponse(
        `The requested resource isn't a valid image (received ${contentType})`,
        { status: 415 }
      );
    }

    // Set response headers with aggressive caching
    const responseHeaders = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      ...(response.headers.has('content-length') && {
        'Content-Length': response.headers.get('content-length')
      })
    });

    // Stream the image data
    return new NextResponse(response.body, { headers: responseHeaders });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse(
      `Internal Server Error: ${error.message}`,
      { status: 500 }
    );
  }
} 