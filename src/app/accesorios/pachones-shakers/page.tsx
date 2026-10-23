import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function PachonesShakersPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-pachones-shakers');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-pachones-shakers"
      title="Accesorios - Pachones y Shakers"
    />
  );
}
