import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function LCarnitinaPage() {
  const filteredProducts = filterProductsByCategory(products, 'suplementos-l-carnitina');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos-l-carnitina"
      title="Suplementos - L-Carnitina"
    />
  );
}
