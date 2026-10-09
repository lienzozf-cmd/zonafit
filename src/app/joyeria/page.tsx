import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function JoyeriaPage() {
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
