'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg', alt: 'Vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.jpeg', alt: 'Darc Sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.png', alt: 'Dragon Pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymsharkk.jpeg', alt: 'Gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.png', alt: 'YoungLA', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.png', alt: 'Raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/c4.png', alt: 'C4 Energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.jpeg', alt: 'RGMNT', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/civilre.png', alt: 'Civil Regime', dataAiHint: 'logo fitness' },
];

const BrandsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`circular-images-container ${isVisible ? 'is-visible' : ''}`}
    >
      {brands.map((brand, index) => (
        <Image
          key={index}
          src={brand.src}
          alt={brand.alt}
          width={150}
          height={150}
          data-ai-hint={brand.dataAiHint}
          className="rounded-full inline-block m-2"
          style={{ transitionDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
};

export default BrandsSection;
