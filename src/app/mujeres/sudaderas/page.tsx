import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function SudaderasPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-sudaderas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-sudaderas"
      title="Mujeres - Sudaderas"
    />
  );
}
