'use client';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="hero-banner">
      <Image
        src="/banner.png"
        alt="Banner principal"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
        data-ai-hint="fitness store"
      />
      <div className="banner-content">
        <button className="buy-now-button">COMPRAR AHORA</button>
      </div>
    </section>
  );
};

export default HeroSection;
