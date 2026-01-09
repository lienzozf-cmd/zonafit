import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function CivilRegimePage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Civil Regime'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Civil Regime"
      hideBrandFilter={true}
    />
  );
}
