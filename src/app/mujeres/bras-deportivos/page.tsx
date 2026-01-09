import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function BrasDeportivosPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'mujer' && product.subcategory === 'bras-deportivo'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Mujeres - Bras Deportivos"
    />
  );
}
