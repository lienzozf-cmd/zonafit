import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ProteinasPage() {
  const filteredProducts = filterProductsByCategory(products, 'suplementos-proteinas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos-proteinas"
      title="Suplementos - Proteínas"
    />
  );
}
