import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ShortsPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-shorts');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-shorts"
      title="Hombres - Shorts"
    />
  );
}
