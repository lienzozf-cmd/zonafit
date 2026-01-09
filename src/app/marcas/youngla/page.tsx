import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function YounglaPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'YoungLA'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - YoungLA"
      hideBrandFilter={true}
    />
  );
}
