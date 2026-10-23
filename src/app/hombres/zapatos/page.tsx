import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ZapatosPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-zapatos');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-zapatos"
      title="Hombres - Zapatos"
    />
  );
}
