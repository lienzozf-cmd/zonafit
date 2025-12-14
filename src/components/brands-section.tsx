
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg?v=2', alt: 'Vanquish', href: '/marcas/vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.png?v=3', alt: 'Darc Sport', href: '/marcas/darc-sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.png?v=2', alt: 'Dragon Pharma', href: '/marcas/dragon-pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymshark.png?v=9', alt: 'Gymshark', href: '/marcas/gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.png?v=3', alt: 'YoungLA', href: '/marcas/youngla', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.png?v=2', alt: 'Raw', href: '/marcas/raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/bumenergy.png?v=7', alt: 'Bum Energy', href: '/marcas/bum-energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.png?v=2', alt: 'RGMNT', href: '/marcas/rgmnt', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/civilr.png?v=7', alt: 'Civil Regime', href: '/marcas/civil-regime', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dfyne.png', alt: 'Dfyne', href: '/marcas/dfyne', dataAiHint: 'logo fitness' },
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Link key={index} href={brand.href} passHref>
            <Image
              src={brand.src}
              alt={brand.alt}
              width={150}
              height={150}
              data-ai-hint={brand.dataAiHint}
              className="rounded-full inline-block m-2"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            />
        </Link>
      ))}
    </div>
  );
};

export default BrandsSection;
