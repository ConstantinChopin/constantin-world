import { useEffect, useRef, useCallback } from 'react';
import ArtworkCard from './ArtworkCard';

export default function ResultsGrid({ results, onLoadMore, isLoading, hasMorePages, onCardClick }) {
  const gridRef = useRef(null);
  const loaderRef = useRef(null);

  // Memoize the intersection observer callback to prevent infinite re-renders
  const handleIntersection = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading && hasMorePages && onLoadMore) {
      onLoadMore();
    }
  }, [isLoading, hasMorePages, onLoadMore]);

  useEffect(() => {
    if (!onLoadMore || !hasMorePages) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleIntersection, hasMorePages]);

  if (!results || results.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0',
        color: '#6b7280'
      }}>
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      paddingBottom: '120px' // Extra space for fixed search bar
    }}>
      <div 
        ref={gridRef}
        className="artwork-grid"
      >
        {results.map((artwork, index) => (
          <div
            key={`${artwork.id}-${index}`}
            className="artwork-item"
          >
            <ArtworkCard 
              artwork={artwork}
              onCardClick={onCardClick}
              index={index}
            />
          </div>
        ))}
      </div>
      
      {hasMorePages && (
        <div 
          ref={loaderRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 0',
            color: '#6b7280'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="spinner" />
              <span>Loading more results...</span>
            </div>
          ) : (
            <span>Scroll down to load more</span>
          )}
        </div>
      )}
      
      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .artwork-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .artwork-item {
          width: 100%;
        }

        @media (max-width: 1200px) {
          .artwork-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .artwork-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .artwork-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 