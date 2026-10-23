import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function AminoacidosPage() {
  const filteredProducts = filterProductsByCategory(products, 'suplementos-aminoacidos');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos-aminoacidos"
      title="Suplementos - Aminoácidos"
    />
  );
}
