import Image from 'next/image';
import { useState, useCallback } from 'react';

export default function ArtworkCard({ artwork, onCardClick, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const MAX_RETRIES = 2;

  if (!artwork) return null;

  const {
    title,
    images,
    creators
  } = artwork;

  // Get the image URL and proxy it if it's from Art Institute or Cleveland
  const originalImageUrl = images && images.length > 0 ? images[0].url : null;
  const shouldProxy = originalImageUrl && (
    originalImageUrl.includes('artic.edu') ||
    originalImageUrl.includes('clevelandart.org')
  );
  const imageUrl = originalImageUrl && shouldProxy
    ? `/api/image-proxy?imageUrl=${encodeURIComponent(originalImageUrl)}`
    : originalImageUrl;

  // Debug logging for the first few cards (reduced from 3 to 1)
  if (index === 0) {
    console.log(`ArtworkCard ${index}:`, {
      title,
      hasImages: !!images,
      imagesLength: images?.length || 0,
      originalImageUrl,
      proxiedImageUrl: imageUrl
    });
  }

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(artwork);
    }
  };

  const handleImageLoad = (event) => {
    const img = event.target;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
    setImageLoaded(true);
    setImageError(false);
    setRetryCount(0);
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    
    // Attempt retry if under max attempts
    if (retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false); // Reset error to trigger reload
      }, 1000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  return (
    <div 
      onClick={handleCardClick}
      className="artwork-card"
    >
      <div className="artwork-frame">
        <div className="artwork-container">
          {imageUrl && !imageError ? (
            <Image
              key={`${imageUrl}-${retryCount}`} // Force reload on retry
              src={imageUrl}
              alt={title || 'Artwork image'}
              fill
              style={{ 
                objectFit: 'contain',
                opacity: imageLoaded ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
              }}
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={index < 8} // Prioritize loading first 8 images
            />
          ) : (
            <div className="placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <span>Image Unavailable</span>
              {retryCount > 0 && retryCount <= MAX_RETRIES && (
                <span className="retry-message">Retrying... ({retryCount}/{MAX_RETRIES})</span>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .artwork-card {
          background-color: #E8E8E8;
          overflow: hidden;
          cursor: ${onCardClick ? 'pointer' : 'default'};
          width: 100%;
          aspect-ratio: 1;
          position: relative;
          margin-bottom: 0;
        }

        .artwork-frame {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          padding: 32px;
        }

        .artwork-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 4px;
        }

        .placeholder {
          width: 100%;
          height: 100%;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          flex-direction: column;
          gap: 8px;
          border-radius: 4px;
        }

        .placeholder span {
          font-size: 10px;
          font-weight: 500;
        }

        .retry-message {
          color: #6b7280;
          font-size: 9px !important;
        }
      `}</style>
    </div>
  );
} 