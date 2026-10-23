import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function MochilasMaletasPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-mochilas-maletas');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-mochilas-maletas"
      title="Accesorios - Mochilas y Maletas"
    />
  );
}
