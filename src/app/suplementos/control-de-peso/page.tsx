import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { filterProductsByCategory } from '@/lib/category-filters';

export const revalidate = 60;

export default async function CategoryPage() {
  const { products } = await getSeoCatalog();
  return <ProductGridPage products={filterProductsByCategory(products, 'suplementos-control-peso')} categoryKey="suplementos-control-peso" title="Suplementos - Control de Peso" />;
}
