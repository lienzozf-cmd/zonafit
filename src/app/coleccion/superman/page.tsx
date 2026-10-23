import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function SupermanCollectionPage() {
  const filteredProducts = filterProductsByCategory(products, 'coleccion-superman');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="coleccion-superman"
      title="⚡ Colección Superman ⚡"
      hideBrandFilter={false}
    />
  );
}
