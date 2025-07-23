'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const heroImages = [
  { src: '/assets/images/banners/banner.jpg', alt: 'Man lifting weights' },
  { src: '/assets/images/banners/banner2.png', alt: 'Woman in athletic wear' },
  { src: '/assets/images/banners/banner3.png', alt: 'Fitness supplements and gear' },
  { src: '/assets/images/banners/banner4.png', alt: 'Man running on a treadmill' },
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
