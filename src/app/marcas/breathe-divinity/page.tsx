import ProductGridPage from '@/components/product-grid-page';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function BreatheDivinityPage() {
  const { products } = await getSeoCatalog();
  const filteredProducts = products.filter(
    (product) => product.brand.trim().toLowerCase() === 'breathe divinity'
  );
  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Breathe Divinity"
      hideBrandFilter={true}
    />
  );
}
