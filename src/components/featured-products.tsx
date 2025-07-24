'use client';
import { products } from '@/lib/data';
import ProductCard from './product-card';
import { useEffect, useRef, useState } from 'react';

const FeaturedProducts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);
  
  return (
    <section className="product-grid" ref={gridRef}>
      {products.map((product, index) => (
        <ProductCard 
            key={product.id} 
            product={product} 
            animate={isVisible}
            animationDelay={index * 100}
        />
      ))}
    </section>
  );
};

export default FeaturedProducts;
