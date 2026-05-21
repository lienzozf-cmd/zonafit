import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function CompresionPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' &&
      product.subcategory === 'playera' &&
      product.is_compression === true
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Playeras de Compresión"
    />
  );
}
