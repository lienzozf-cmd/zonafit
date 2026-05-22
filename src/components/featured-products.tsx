'use client';
import ProductCard from './product-card';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/stores/cart-store';

const FeaturedProducts = () => {
  const products = useCartStore((state) => state.products);
  const sessionId = useCartStore((state) => state.sessionId);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Mapeo solicitado (actualizado):
  // 2720 - Batman Compression (reemplaza a 2700) - AHORA EN PRIMERA POSICIÓN
  // 2662 - Impact Shorts 4.5 Azul (reemplaza a 2687)
  // 2724 - Itachi Forever (reemplaza a 2667)
  // 2677 - Isophorm (se mantiene)
  // 3004 - Gojo (reemplaza a 2726 Gold's Iron Legacy)
  // 3026 - AOT x YLA Classic Tees hero levi (reemplaza a 2711 Gymshark X Analis)
  // 3009 - The Split-Heart Pendant (reemplaza a 2686 The North Star)
  // 3020 - Glycerol (reemplaza a 8 Creatina)
  // 2693 - Isophorm (se mantiene)
  // 3037 - Adapt Animal X Whitney Shorts (reemplaza a 2520 Legacy Bra)
  // 3034 - Batman Armored Sweats
  // 3003 - Sukuna
  const featuredProductIds = [2720, 3034, 2724, 2677, 3003, 3004, 3026, 3009, 3020, 2693, 3037, 2662];

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
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[#050505] -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
      
        <div className="flex flex-col items-center mb-12 px-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-8 sm:w-12 bg-red-600" />
            <span className="text-red-600 font-black tracking-[0.3em] text-[10px] sm:text-xs uppercase">Premium Collection</span>
            <div className="h-[1px] w-8 sm:w-12 bg-red-600" />
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white text-center tracking-tighter mb-4">
            NUEVO <span className="text-red-600 drop-shadow-[0_0_15px_rgba(229,0,0,0.4)]">INGRESO</span>
          </h2>
          
          <p className="text-zinc-500 text-center max-w-lg text-sm sm:text-base font-medium">
            Descubre las últimas tendencias en ropa de compresión y suplementación de alto nivel.
          </p>
        </div>

        <div className="product-grid featured-product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              sessionId={sessionId}
              index={index}
            />
          ))}
        </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
    </section>
  );
};

export default FeaturedProducts;
