import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function AccesoriosPage() {
  const { products } = await getSeoCatalog();
  const filteredProducts = products.filter(
    (product) => product.category === 'accesorio'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios"
      title="Accesorios - Ver Todo"
    />
  );
}
