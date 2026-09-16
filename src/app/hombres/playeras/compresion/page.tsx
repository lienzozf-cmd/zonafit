import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function CompresionPage() {
  const filteredProducts = filterProductsByCategory(products, 'hombres-compresion');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="hombres-compresion"
      title="Hombres - Playeras de Compresión"
    />
  );
}
