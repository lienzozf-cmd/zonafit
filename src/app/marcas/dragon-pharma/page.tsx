import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function DragonPharmaPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Dragon Pharma'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Dragon Pharma"
      hideBrandFilter={true}
    />
  );
}
