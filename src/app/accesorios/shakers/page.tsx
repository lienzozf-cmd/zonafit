import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ShakersPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-shakers');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-shakers"
      title="Accesorios - Shakers"
    />
  );
}
