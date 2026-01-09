import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function DarcSportPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Darc Sport'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Darc Sport"
      hideBrandFilter={true}
    />
  );
}
