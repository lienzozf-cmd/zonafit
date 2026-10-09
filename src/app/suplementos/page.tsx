import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function SuplementosPage() {
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
