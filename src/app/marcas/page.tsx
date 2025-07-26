
'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { useProductStore } from '@/stores/product-store';

export default function MarcasPage() {
  const { products } = useProductStore();

  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Marcas - Ver Todo
          </h1>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center">
              No hay productos disponibles.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
