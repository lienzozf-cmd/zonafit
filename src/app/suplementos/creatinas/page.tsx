import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function CreatinasPage() {
  const filteredProducts = filterProductsByCategory(products, 'suplementos-creatinas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos-creatinas"
      title="Suplementos - Creatinas"
    />
  );
}
