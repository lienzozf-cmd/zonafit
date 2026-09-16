import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function OversizePage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-oversize');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-oversize"
      title="Hombres - Playeras Oversize"
    />
  );
}
