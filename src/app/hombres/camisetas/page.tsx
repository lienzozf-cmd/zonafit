import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function CamisetasPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-camisetas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-camisetas"
      title="Hombres - Camisetas"
    />
  );
}
