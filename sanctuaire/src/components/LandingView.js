import { useState, useEffect } from 'react';
import styles from './LandingView.module.css';
import ArtworkCard from './ArtworkCard';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LandingView() {
  const [artworks, setArtworks] = useState([]);
  const [artworkStyles, setArtworkStyles] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/landing');
        const data = await response.json();
        const shuffledArtworks = shuffleArray([...data]);
        setArtworks(shuffledArtworks);
      } catch (error) {
        console.error('Error fetching landing artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    if (artworks.length > 0) {
      const styles = artworks.map(() => {
        const scale = Math.random() * 0.5 + 0.3; // scale from 0.3 to 0.8
        const opacity = scale * 0.55; // increased opacity multiplier for less transparency
        const top = 50 + (Math.random() - 0.5) * 70; // center ±35% from middle
        const left = 50 + (Math.random() - 0.5) * 70; // center ±35% from middle
        return {
          top: `${top}%`,
          left: `${left}%`,
          width: `${Math.random() * 100 + 80}px`, // width from 80px to 180px
          transform: `scale(${scale})`,
          opacity,
        };
      });
      setArtworkStyles(styles);
      setTimeout(() => setVisible(true), 100);
    }
  }, [artworks]);

  return (
    <div className={`${styles.landingGrid} ${visible ? styles.visible : ''}`}>
      {artworks.map((artwork, index) => {
        const style = artworkStyles[index];
        if (!style) return null;

        return (
          <div
            key={artwork.id}
            className={styles.gridTile}
            style={{
              top: style.top,
              left: style.left,
              width: style.width,
              animationDelay: `${index * 0.1}s`,
              '--final-scale': style.transform,
              '--final-opacity': style.opacity,
            }}
          >
            <ArtworkCard artwork={artwork} />
          </div>
        );
      })}
    </div>
  );
} 