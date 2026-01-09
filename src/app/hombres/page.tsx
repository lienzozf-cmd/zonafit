import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function HombresPage() {
  const filteredProducts = products.filter(
    (product) => product.gender === 'hombre'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Ver Todo"
    />
  );
}
