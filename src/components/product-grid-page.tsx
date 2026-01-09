
'use client';

import { useState, useMemo } from 'react';
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
  const { sessionId } = useCartStore((state) => ({
    sessionId: state.sessionId,
  }));
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
    let filtered = initialProducts;

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
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
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
