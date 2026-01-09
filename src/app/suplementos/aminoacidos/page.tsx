import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function AminoacidosPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'suplemento' && product.subcategory === 'aminoacidos'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - Aminoácidos"
    />
  );
}
