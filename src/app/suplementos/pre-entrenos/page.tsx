import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function PreEntrenosPage() {
  const filteredProducts = filterProductsByCategory(products, 'suplementos-pre-entrenos');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos-pre-entrenos"
      title="Suplementos - Pre Entrenos"
    />
  );
}
