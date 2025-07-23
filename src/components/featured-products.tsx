import { products } from '@/lib/data';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center font-headline mb-8">
        NUESTROS PRODUCTOS MÁS SOLICITADOS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
