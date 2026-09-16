import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function TanksPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-tanks');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-tanks"
      title="Hombres - Tanks"
    />
  );
}
