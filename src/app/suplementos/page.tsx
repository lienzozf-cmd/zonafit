import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function SuplementosPage() {
  const filteredProducts = products.filter(
    (product) => product.category === 'suplemento'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - Ver Todo"
    />
  );
}
