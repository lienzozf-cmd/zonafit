import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function LeggingsPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-leggings');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-leggings"
      title="Mujeres - Leggings"
    />
  );
}
