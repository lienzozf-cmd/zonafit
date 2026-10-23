import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function MochilasPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-mochilas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-mochilas"
      title="Accesorios - Mochilas"
    />
  );
}
