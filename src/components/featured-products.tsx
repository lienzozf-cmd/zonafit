'use client';
import ProductCard from './product-card';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/stores/cart-store';

const FeaturedProducts = () => {
  const { products, sessionId } = useCartStore((state) => ({
    products: state.products,
    sessionId: state.sessionId,
  }));
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Se reemplaza ID 2668 (Nezuko) por 2700 (Mini Gym Bag)
  // Se reemplaza ID 2643 (Superman 4117) por 2711 (Analis Leggings)
  const featuredProductIds = [1, 2697, 2667, 2664, 2700, 2711, 2686, 8];

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(product =>
        featuredProductIds.includes(product.id)
      ).sort((a, b) => featuredProductIds.indexOf(a.id) - featuredProductIds.indexOf(b.id));
      setFeaturedProducts(filtered);
    }
  }, [products]);

  if (featuredProducts.length === 0) {
    return null; // Or a loading skeleton
  }

  return (
    <section className="product-grid featured-product-grid">
      {featuredProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          sessionId={sessionId}
          index={index}
        />
      ))}
    </section>
  );
};

export default FeaturedProducts;
