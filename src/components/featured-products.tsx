'use client';
import { products } from '@/lib/data';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default FeaturedProducts;
