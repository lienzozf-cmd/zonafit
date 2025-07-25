'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg', alt: 'Vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.jpeg', alt: 'Darc Sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.png', alt: 'Dragon Pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymshark.png', alt: 'Gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.png', alt: 'YoungLA', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.png', alt: 'Raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/c4.png', alt: 'C4 Energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.jpeg', alt: 'RGMNT', dataAiHint: 'logo fitness' },
];

const BrandsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="circular-images-container" ref={containerRef}>
      {brands.map((brand, index) => (
        <Image
          key={index}
          src={brand.src}
          alt={brand.alt}
          width={150}
          height={150}
          data-ai-hint={brand.dataAiHint}
          className={`rounded-full inline-block m-2 transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  );
};

export default BrandsSection;
