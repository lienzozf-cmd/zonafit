import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function SuplementosPage() {
  const { products } = await getSeoCatalog();
  const filteredProducts = products.filter(
    (product) => product.category === 'suplemento'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="suplementos"
      title="Suplementos - Ver Todo"
    />
  );
}
