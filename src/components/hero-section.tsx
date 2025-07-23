'use client';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="hero-banner">
      <Image
        src="/banner1.png"
        alt="Banner principal"
        layout="fill"
        objectFit="cover"
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
