import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function AccesoriosPage() {
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
