import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function MujeresPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres"
      title="Mujeres - Ver Todo"
    />
  );
}
