
'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Product } from '@/lib/data';
import FilterSortControls from '@/components/filter-sort-controls';
import { useProductStore } from '@/providers/product-provider';

export default function MujeresPage() {
  const products = useProductStore((state) => state.products);
  const [sortOption, setSortOption] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const filteredProducts = products.filter(
    (product) => product.gender === 'mujer'
  );

  const getBrands = (products: Product[]) => {
    const brands = products.map(p => p.brand);
    return [...new Set(brands)];
  };

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
  
  const brandFilteredProducts = selectedBrand && selectedBrand !== 'all'
    ? filteredProducts.filter(p => p.brand === selectedBrand)
    : filteredProducts;

  const displayedProducts = sortProducts(brandFilteredProducts, sortOption);
  const availableBrands = getBrands(filteredProducts);

  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Mujeres - Ver Todo
          </h1>
          <FilterSortControls
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            brands={availableBrands}
          />
          {displayedProducts.length > 0 ? (
            <div className="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
