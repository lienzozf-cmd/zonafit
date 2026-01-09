import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function AccesoriosPage() {
  const filteredProducts = products.filter(
    (product) => product.category === 'accesorio'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Ver Todo"
    />
  );
}
