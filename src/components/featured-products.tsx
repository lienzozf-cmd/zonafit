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

  // Mapeo solicitado (IDs actualizados según últimas peticiones):
  // 2720 - Batman Compression (reemplaza a 2700) - AHORA EN PRIMERA POSICIÓN
  // 2662 - Impact Shorts 4.5 Azul (reemplaza a 2687)
  // 2724 - Itachi Forever (reemplaza a 2667)
  // 2677 - Isophorm (se mantiene)
  // 2726 - Gold's Iron Legacy Compression (reemplaza a 1) - AHORA EN QUINTA POSICIÓN
  // 2711 - Gymshark X Analis (se mantiene)
  // 2686 - The North Star (se mantiene)
  // 8 - Creatina (se mantiene)
  const featuredProductIds = [2720, 2662, 2724, 2677, 2726, 2711, 2686, 8];

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
