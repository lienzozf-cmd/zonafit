'use client';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="hero-banner">
      <div className="carousel-container">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Banner principal"
          fill
          data-ai-hint="fitness store"
          className="carousel-image active"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="banner-content">
        <button className="buy-now-button">COMPRAR AHORA</button>
      </div>
    </section>
  );
};

export default HeroSection;
