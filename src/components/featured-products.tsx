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

  // Se reemplaza ID 2664 (Raw Carlos Belcast) por 2677 (Isophorm)
  const featuredProductIds = [1, 2687, 2667, 2677, 2700, 2711, 2686, 8];

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