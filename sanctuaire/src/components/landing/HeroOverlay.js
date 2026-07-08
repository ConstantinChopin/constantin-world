import SearchBar from '../SearchBar';

export default function HeroOverlay() {
  return (
    <div className="hero-overlay">
      <div className="hero-text">
        <h2>
          <span className="title">Sanctuaire.</span>
          {' '}
          <span className="subtitle">Human creativity from museums around the world</span>
        </h2>
      </div>
      <style jsx>{`
        .hero-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          padding: 3rem;
          border-radius: 12px;
          min-width: 320px;
        }

        .hero-text {
          width: 409px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        h2 {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-size: 26px;
          line-height: 37px;
          letter-spacing: -0.12px;
          font-weight: 500;
        }

        .title {
          color: #1E293B;
        }

        .subtitle {
          color: #64748B;
        }

        @media (max-width: 640px) {
          .hero-overlay {
            padding: 2rem;
            width: 90%;
          }

          .hero-text {
            width: 100%;
          }

          h2 {
            font-size: 20px;
            line-height: 28px;
          }
        }
      `}</style>
    </div>
  );
} 