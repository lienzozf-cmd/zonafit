import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function ChamarrasPage() {
  const filteredProducts = filterProductsByCategory(products, 'mujeres-chamarras');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="mujeres-chamarras"
      title="Mujeres - Chamarras"
    />
  );
}
