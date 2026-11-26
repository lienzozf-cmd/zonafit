import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { filterProductsByCategory } from '@/lib/category-filters';

export const revalidate = 60;

export default async function EnterizosPage() {
  const { products } = await getSeoCatalog();
  return <ProductGridPage products={filterProductsByCategory(products, 'mujeres-enterizos')} categoryKey="mujeres-enterizos" title="Mujeres - Enterizos" />;
}
