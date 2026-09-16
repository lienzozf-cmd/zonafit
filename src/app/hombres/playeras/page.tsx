import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function PlayerasPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-playeras');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-playeras"
      title="Hombres - Playeras"
    />
  );
}
