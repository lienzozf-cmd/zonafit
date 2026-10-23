import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function GorrasPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-gorras');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-gorras"
      title="Accesorios - Gorras"
    />
  );
}
