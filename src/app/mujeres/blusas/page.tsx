import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function BlusasPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-blusas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-blusas"
      title="Mujeres - Blusas y Tops"
    />
  );
}
