import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading, placeholder = "Search anything" }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    onSearch(searchQuery.trim());
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.searchArrow}
          disabled={isLoading}
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </form>
  );
} 