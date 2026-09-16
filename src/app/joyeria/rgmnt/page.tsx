import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function RgmntPage() {
  const filteredProducts = filterProductsByCategory(products, 'joyeria-rgmnt');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="joyeria-rgmnt"
      title="Joyería - RGMNT"
    />
  );
}
