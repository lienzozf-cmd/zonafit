'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const heroImages = [
  { src: 'https://placehold.co/1920x1080.png', alt: 'Man lifting weights', dataAiHint: 'man fitness' },
  { src: 'https://placehold.co/1920x1080.png', alt: 'Woman in athletic wear', dataAiHint: 'woman fitness' },
  { src: 'https://placehold.co/1920x1080.png', alt: 'Fitness supplements and gear', dataAiHint: 'fitness gear' },
  { src: 'https://placehold.co/1920x1080.png', alt: 'Man running on a treadmill', dataAiHint: 'man running' },
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-banner">
      <div className="carousel-container">
        {heroImages.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            fill
            data-ai-hint={image.dataAiHint}
            className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
            priority={index === 0}
          />
        ))}
      </div>
      <div className="banner-content">
        <button className="buy-now-button">COMPRAR AHORA</button>
      </div>
    </section>
  );
};

export default HeroSection;
