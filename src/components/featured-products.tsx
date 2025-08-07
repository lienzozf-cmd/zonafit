'use client';
import { useProductStore } from '@/stores/product-store';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  const { products } = useProductStore();
  const featuredProducts = products.filter(
    (product) => product.id >= 1 && product.id <= 8
  );

  return (
    <section className="product-grid featured-product-grid">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default FeaturedProducts;
