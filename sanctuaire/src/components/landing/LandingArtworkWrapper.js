import ArtworkCard from '../ArtworkCard';

export default function LandingArtworkWrapper({ artwork, size = 'regular' }) {
  return (
    <div className={`landing-artwork-wrapper ${size}`}>
      <ArtworkCard 
        artwork={artwork}
        onCardClick={null}
      />
      <style jsx>{`
        .landing-artwork-wrapper {
          position: relative;
          width: 100%;
        }

        .landing-artwork-wrapper.large {
          grid-column: span 2;
          grid-row: span 2;
        }

        /* Ensure wrapper takes full height in grid */
        .landing-artwork-wrapper > :global(.artwork-card) {
          height: 100%;
        }
      `}</style>
    </div>
  );
} 