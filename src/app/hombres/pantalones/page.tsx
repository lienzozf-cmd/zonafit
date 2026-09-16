import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function PantalonesPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-pants');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-pants"
      title="Hombres - Pants"
    />
  );
}
