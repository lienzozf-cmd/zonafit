import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { filterProductsByCategory } from '@/lib/category-filters';

export const revalidate = 60;

export default async function CategoryPage() {
  const { products } = await getSeoCatalog();
  return <ProductGridPage products={filterProductsByCategory(products, 'suplementos-bienestar')} categoryKey="suplementos-bienestar" title="Suplementos - Salud y Bienestar" />;
}
