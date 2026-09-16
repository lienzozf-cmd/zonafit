import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function SudaderasPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-sudaderas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-sudaderas"
      title="Hombres - Sudaderas"
    />
  );
}
