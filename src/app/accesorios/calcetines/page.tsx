import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function CalcetinesPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-calcetines');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-calcetines"
      title="Accesorios - Calcetines"
    />
  );
}
