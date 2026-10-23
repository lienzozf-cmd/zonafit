import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function AnimePage() {
  const filteredProducts = filterProductsByCategory(products, 'anime');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="anime"
      title="Colección Anime"
    />
  );
}
