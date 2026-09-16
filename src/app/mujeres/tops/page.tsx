import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function TopsPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-tops');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-tops"
      title="Mujeres - Tops"
    />
  );
}
