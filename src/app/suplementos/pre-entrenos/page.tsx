import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function PreEntrenosPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'suplemento' && product.subcategory === 'pre-entreno'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - Pre Entrenos"
    />
  );
}
