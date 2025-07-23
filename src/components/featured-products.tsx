import { products } from '@/lib/data';
import ProductCard from './product-card';

const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section>
       <h2 style={{color: 'white', textAlign: 'center'}}>NUESTROS PRODUCTOS MÁS SOLICITADOS</h2>
      <div className="product-grid">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
