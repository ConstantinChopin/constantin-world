"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import SearchBar from '@/components/SearchBar';
import ResultsGrid from '@/components/ResultsGrid';
import LandingView from '@/components/LandingView';
import Breadcrumb from '@/components/Breadcrumb';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const handleCardClick = async (artwork) => {
    if (!artwork) return;
    
    // Create a search context based on the artwork's properties
    const relatedQuery = artwork.title.split(' ').slice(0, 2).join(' '); // Use first two words of title
    const searchContext = {
      isRelatedSearch: true,
      sourceArtwork: {
        artist: artwork.creators?.[0]?.name,
        culture: artwork.culture,
        classification: artwork.classification
      }
    };

    // Update breadcrumb to show the navigation path
    setBreadcrumbItems(prev => [
      ...prev,
      { 
        type: 'artwork', 
        text: artwork.title,
        data: artwork
      }
    ]);

    // Perform the search with the related context
    handleSearch(relatedQuery, 1, searchContext);
  };

  const handleSearch = async (query, page = 1, searchContext = null) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearch('');
      setBreadcrumbItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        query: query,
        page: page.toString()
      });

      if (searchContext) {
        searchParams.append('context', encodeURIComponent(JSON.stringify(searchContext)));
      }

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      const data = await response.json();
      
      if (page === 1) {
        setSearchResults(data.data);
        if (!searchContext) {
          setBreadcrumbItems([{ type: 'search', text: query }]);
        }
      } else {
        setSearchResults(prev => [...prev, ...data.data]);
      }
      
      setHasMorePages(data.pagination.hasMore);
      setCurrentPage(page);
      setCurrentSearch(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMorePages && currentSearch) {
      handleSearch(currentSearch, currentPage + 1);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setCurrentSearch('');
    setCurrentPage(1);
    setHasMorePages(false);
    setBreadcrumbItems([]);
  };

  useEffect(() => {
    const handleBreadcrumbSearch = (event) => {
      const { searchTerm, context, updatedItems } = event.detail;
      if (searchTerm) {
        // Update breadcrumb items if provided
        if (updatedItems) {
          setBreadcrumbItems(updatedItems);
        }
        handleSearch(searchTerm, 1, context);
      } else {
        handleClearSearch();
      }
    };

    window.addEventListener('breadcrumbSearch', handleBreadcrumbSearch);
    return () => window.removeEventListener('breadcrumbSearch', handleBreadcrumbSearch);
  }, []);

  return (
    <main className={styles.main}>
      {!currentSearch && (
        <div className={styles.titleContainer}>
          <h2>Sanctuaire. <span className={styles.subtitle}>Human creativity from museums around the world</span></h2>
        </div>
      )}
      
      {currentSearch && <Breadcrumb breadcrumbItems={breadcrumbItems} />}
      
      <div className={styles.searchContainer}>
        <SearchBar 
          onSearch={(query) => handleSearch(query)} 
          isLoading={isLoading}
          placeholder="Search artworks..."
        />
      </div>

      {!currentSearch && <LandingView />}
      
      {currentSearch && (
        <div className={styles.resultsContainer}>
          <ResultsGrid
            results={searchResults}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            hasMorePages={hasMorePages}
            onCardClick={handleCardClick}
          />
        </div>
      )}
    </main>
  );
}
