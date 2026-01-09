import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function GymsharkPage() {
  const filteredProducts = products.filter(
    (product) => product.brand === 'Gymshark'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Marca - Gymshark"
      hideBrandFilter={true}
    />
  );
}
