'use client';
import { useProductStore } from '@/stores/product-store';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  const { products } = useProductStore();
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default FeaturedProducts;
