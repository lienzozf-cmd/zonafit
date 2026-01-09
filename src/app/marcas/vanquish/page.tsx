import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function VanquishPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Vanquish'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Vanquish"
      hideBrandFilter={true}
    />
  );
}
