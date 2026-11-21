import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function JoyeriaPage() {
  const { products } = await getSeoCatalog();
  const filteredProducts = products.filter(
    (product) => product.category === 'joyeria'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="joyeria"
      title="Joyería - Ver Todo"
    />
  );
}
