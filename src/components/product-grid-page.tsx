
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Product } from '@/lib/data';
import FilterSortControls from '@/components/filter-sort-controls';
import { useCartStore } from '@/stores/cart-store';

interface ProductGridPageProps {
  products: Product[];
  title: string;
  hideBrandFilter?: boolean;
}

export default function ProductGridPage({
  products: initialProducts,
  title,
  hideBrandFilter = false,
}: ProductGridPageProps) {
  const sessionId = useCartStore((state) => state.sessionId);
  const [sortOption, setSortOption] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const availableBrands = useMemo(() => {
    const brands = initialProducts.map(p => p.brand);
    return [...new Set(brands)];
  }, [initialProducts]);

  const isProductAvailable = (product: Product) => {
    if (product.colors && product.colors.length > 0) {
      return product.colors.some(color => color.options.values.some(option => option.stock > 0));
    }
    return product.options.values.some(option => option.stock > 0);
  };
  
  const displayedProducts = useMemo(() => {
    let filtered = initialProducts.filter(p => p.visible !== false);

    if (!hideBrandFilter && selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    const sorted = [...filtered].sort((a, b) => {
        const aAvailable = isProductAvailable(a);
        const bAvailable = isProductAvailable(b);
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        return 0;
    });

    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => {
            const aAvailable = isProductAvailable(a);
            const bAvailable = isProductAvailable(b);
            if (aAvailable && !bAvailable) return -1;
            if (!aAvailable && bAvailable) return 1;
            return parseFloat(a.price.replace(/Q|\s/g, '')) - parseFloat(b.price.replace(/Q|\s/g, ''));
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
            const aAvailable = isProductAvailable(a);
            const bAvailable = isProductAvailable(b);
            if (aAvailable && !bAvailable) return -1;
            if (!aAvailable && bAvailable) return 1;
            return parseFloat(b.price.replace(/Q|\s/g, '')) - parseFloat(a.price.replace(/Q|\s/g, ''));
        });
      default:
        return sorted;
    }
  }, [initialProducts, selectedBrand, sortOption, hideBrandFilter]);

  return (
    <>
      <Header />
      <main className="bg-transparent text-white min-h-[70vh]">
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white text-xs sm:text-sm font-bold tracking-wide transition-all hover:scale-105 shadow-lg group"
            >
              <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-8 text-white uppercase tracking-wider">
            {title}
          </h1>
          <FilterSortControls
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            brands={availableBrands}
            hideBrandFilter={hideBrandFilter}
          />
          {displayedProducts.length > 0 ? (
            <div className="product-grid">
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sessionId={sessionId}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-center">
              No hay productos en esta categoría.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
