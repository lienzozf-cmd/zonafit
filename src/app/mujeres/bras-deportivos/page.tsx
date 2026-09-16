import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function BrasDeportivosPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-bras');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-bras"
      title="Mujeres - Bras Deportivos"
    />
  );
}
