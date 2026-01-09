import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function RgmntPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'RGMNT'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - RGMNT"
      hideBrandFilter={true}
    />
  );
}
