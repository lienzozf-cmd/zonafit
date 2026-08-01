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
  // 1. ONYX 5.0 SEAMLESS-T SHIRT (3)
  // 2. Onyx 5.0 long sleeve (2671)
  // 3. 4259 - Batman Compression Tees (3052)
  // 4. 8004 - Batman Compression Longsleeves (2720)
  // 5. 4117 - Superman Compression Tees color black red (2643)
  // 6. ISOPHORM - PREMIUM WHEY PROTEIN ISOLATE - 2Lb cookies and cream (2677)
  // 7. Wrath Of Sukuna "Side By Side" 199X Oversized Tee (3003)
  // 8. 4191 - AOT x YLA Classic Tees (3026)
  // 9. The Split-Heart Pendant - Gold RG1044 (3009)
  // 10. CREATINA 80 SERVS muscletech (2721)
  // 11. Impact Shorts | 4.5" (2662)
  // 12. 5195 - Demon Slayer: Kimetsu no Yaiba - Zip-ups nezuko (3054)
  const featuredProductIds = [3, 2671, 3052, 2720, 2643, 2677, 3003, 3026, 3009, 2721, 2662, 3054];

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
