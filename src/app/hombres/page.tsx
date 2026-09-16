import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function HombresPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres"
      title="Hombres - Ver Todo"
    />
  );
}
