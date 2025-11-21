'use client';
import { useProductStore } from '@/components/store-provider';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  const { products } = useProductStore();
  // Define a specific list of featured product IDs
  const featuredProductIds = [1, 2, 3, 4, 5, 2643, 6, 7, 8];
  
  const featuredProducts = products.filter(product =>
    featuredProductIds.includes(product.id)
  ).sort((a, b) => featuredProductIds.indexOf(a.id) - featuredProductIds.indexOf(b.id));


  return (
    <section className="product-grid">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default FeaturedProducts;
