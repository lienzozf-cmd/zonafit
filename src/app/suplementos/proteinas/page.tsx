import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function ProteinasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'suplemento' && product.subcategory === 'proteina'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - Proteínas"
    />
  );
}
