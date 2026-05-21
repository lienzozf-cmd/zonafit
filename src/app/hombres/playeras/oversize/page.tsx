import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function OversizePage() {
  const filteredProducts = (products as any[]).filter(
    (product) =>
      product.gender === 'hombre' &&
      product.subcategory === 'playera' &&
      !product.is_compression &&
      (
        product.name.toLowerCase().includes('oversize') ||
        product.is_oversized === true
      )
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Playeras Oversize"
    />
  );
}
