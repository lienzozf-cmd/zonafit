import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function MarcasPage() {
  return (
    <ProductGridPage
      products={products}
      title="Marcas - Ver Todo"
    />
  );
}
