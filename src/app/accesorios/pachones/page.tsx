import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function PachonesPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-pachones');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-pachones"
      title="Accesorios - Pachones"
    />
  );
}
