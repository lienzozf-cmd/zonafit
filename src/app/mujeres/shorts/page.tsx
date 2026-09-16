import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ShortsPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-shorts');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-shorts"
      title="Mujeres - Shorts"
    />
  );
}
