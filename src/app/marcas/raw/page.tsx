import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function RawPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'RAW'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - RAW"
      hideBrandFilter={true}
    />
  );
}
