import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function MarcasPage() {
  const { products } = await getSeoCatalog();
  return (
    <ProductGridPage
      products={products}
      title="Marcas - Ver Todo"
    />
  );
}
