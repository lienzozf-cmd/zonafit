import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function MujeresPantalonesPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-pants');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-pants"
      title="Mujeres - Pants"
    />
  );
}
