import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function JoyeriaPage() {
  const filteredProducts = products.filter(
    (product) => product.category === 'joyeria'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Joyería - Ver Todo"
    />
  );
}
