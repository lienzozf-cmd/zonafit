
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Product, isProductAvailable } from '@/lib/data';
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
  const storeProducts = useCartStore((state) => state.products);
  const getProductOption = useCartStore((state) => state.getProductOption);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const [sortOption, setSortOption] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Asegurar que los productos de la tienda se carguen si aún no están presentes
  useEffect(() => {
    if (!storeProducts || storeProducts.length === 0) {
      fetchProducts();
    }
  }, [storeProducts, fetchProducts]);

  // Sincronizar productos iniciales con el stock dinámico y en tiempo real de la tienda
  const mergedProducts = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return initialProducts;
    return initialProducts.map(p => storeProducts.find(sp => String(sp.id) === String(p.id)) || p);
  }, [initialProducts, storeProducts]);

  const availableBrands = useMemo(() => {
    const brands = mergedProducts.map(p => p.brand);
    return [...new Set(brands)];
  }, [mergedProducts]);

  // Misma comprobación de stock que ejecuta ProductCard
  const checkIsProductAvailable = (p: Product): boolean => {
    const storeProduct = storeProducts.find(sp => String(sp.id) === String(p.id));
    const prod = storeProduct || p;

    if (prod.availability === 'Agotado') return false;

    // Si los productos de la tienda están disponibles, consultar directamente getProductOption
    if (storeProducts && storeProducts.length > 0) {
      if (prod.colors && prod.colors.length > 0) {
        return prod.colors.some(c =>
          (c.options?.values || []).some(v => (getProductOption(prod.id, v.value, c.name)?.stock ?? 0) > 0)
        );
      }
      return (prod.options?.values || []).some(v => (getProductOption(prod.id, v.value)?.stock ?? 0) > 0);
    }

    return isProductAvailable(prod);
  };
  
  const displayedProducts = useMemo(() => {
    let filtered = mergedProducts.filter(p => p.visible !== false);

    if (!hideBrandFilter && selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    const getNumericPrice = (p: Product) => {
      const parsed = parseFloat(p.price.replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    };

    return [...filtered].sort((a, b) => {
      const aAvailable = checkIsProductAvailable(a);
      const bAvailable = checkIsProductAvailable(b);

      // Los productos disponibles van primero; los productos agotados van estrictamente hasta abajo
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;

      // Si ambos son disponibles o ambos son agotados, aplicar el ordenamiento secundario
      if (sortOption === 'price-asc') {
        return getNumericPrice(a) - getNumericPrice(b);
      }
      if (sortOption === 'price-desc') {
        return getNumericPrice(b) - getNumericPrice(a);
      }

      return 0;
    });
  }, [mergedProducts, storeProducts, selectedBrand, sortOption, hideBrandFilter, getProductOption]);

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
