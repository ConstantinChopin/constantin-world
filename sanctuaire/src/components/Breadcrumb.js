export default function Breadcrumb({ breadcrumbItems = [] }) {
  const handleBreadcrumbClick = (item, index) => {
    // If clicking Home, clear the search
    if (!item) {
      const event = new CustomEvent('breadcrumbSearch', { 
        detail: { searchTerm: '', context: null } 
      });
      window.dispatchEvent(event);
      return;
    }

    // For artwork items, create a search context
    let searchContext = null;
    let searchTerm = item.text;

    if (item.type === 'artwork' && item.data) {
      searchContext = {
        isRelatedSearch: true,
        sourceArtwork: {
          artist: item.data.creators?.[0]?.name,
          culture: item.data.culture,
          classification: item.data.classification
        }
      };
      // Use first two words of artwork title as search term
      searchTerm = item.data.title.split(' ').slice(0, 2).join(' ');
    }

    // When clicking a breadcrumb, only keep items up to that point
    const updatedItems = breadcrumbItems.slice(0, index + 1);
    
    // Trigger a new search with the selected term and context
    const event = new CustomEvent('breadcrumbSearch', { 
      detail: { 
        searchTerm,
        context: searchContext,
        updatedItems
      } 
    });
    window.dispatchEvent(event);
  };

  if (breadcrumbItems.length === 0) {
    return null; // Don't render breadcrumb if no breadcrumb items
  }

  return (
    <nav className="breadcrumb" style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#666' }}>Search path:</span>
        <span 
          onClick={() => handleBreadcrumbClick(null)}
          style={{ 
            cursor: 'pointer', 
            color: '#0066cc',
            textDecoration: 'none',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0'
          }}
        >
          Home
        </span>
        {breadcrumbItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#666' }}>{">"}</span>
            <span 
              onClick={() => handleBreadcrumbClick(item, index)}
              style={{ 
                cursor: 'pointer',
                color: '#0066cc',
                textDecoration: 'none',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                backgroundColor: index === breadcrumbItems.length - 1 ? '#e6f2ff' : '#f0f0f0',
                fontWeight: index === breadcrumbItems.length - 1 ? 'bold' : 'normal',
                fontStyle: item.type === 'artwork' ? 'italic' : 'normal'
              }}
            >
              {item.type === 'search' ? `"${item.text}"` : item.text}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
} 