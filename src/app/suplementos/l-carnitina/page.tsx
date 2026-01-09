import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function LCarnitinaPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'suplemento' && product.subcategory === 'l-carnitina'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - L-Carnitina"
    />
  );
}
