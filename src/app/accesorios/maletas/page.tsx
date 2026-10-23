import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function MaletasPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-maletas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-maletas"
      title="Accesorios - Maletas"
    />
  );
}
