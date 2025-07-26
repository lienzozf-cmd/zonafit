
'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { useProductStore } from '@/stores/product-store';

export default function TanksPage() {
  const { products } = useProductStore();
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'tank'
  );

  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Hombres - Tanks
          </h1>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
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
