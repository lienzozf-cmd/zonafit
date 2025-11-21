
'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Product } from '@/lib/data';
import FilterSortControls from '@/components/filter-sort-controls';
import { useCart } from '@/hooks/use-cart';

export default function RgmntPage() {
  const products = useCart((state) => state.products);
  const [sortOption, setSortOption] = useState('');

  const filteredProducts = products.filter(
    (product) => product.brand === 'RGMNT'
  );

  const sortProducts = (products: Product[], option: string) => {
    const sorted = [...products];
    switch (option) {
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.price.replace(/Q|\s/g, '')) - parseFloat(b.price.replace(/Q|\s/g, '')));
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.price.replace(/Q|\s/g, '')) - parseFloat(a.price.replace(/Q|\s/g, '')));
      default:
        return sorted;
    }
  };
  
  const displayedProducts = sortProducts(filteredProducts, sortOption);
  
  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Marca - RGMNT
          </h1>
          <FilterSortControls
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedBrand={'RGMNT'}
            setSelectedBrand={() => {}}
            brands={[]}
            hideBrandFilter={true}
          />
          {displayedProducts.length > 0 ? (
            <div className="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center">
              No hay productos de esta marca.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
