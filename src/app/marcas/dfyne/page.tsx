import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function DfynePage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'DFYNE'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - DFYNE"
      hideBrandFilter={true}
    />
  );
}
