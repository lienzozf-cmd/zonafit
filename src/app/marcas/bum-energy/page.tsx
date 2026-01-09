import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function BumEnergyPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Bum Energy'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Bum Energy"
      hideBrandFilter={true}
    />
  );
}
