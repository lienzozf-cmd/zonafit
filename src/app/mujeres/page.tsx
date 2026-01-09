import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function MujeresPage() {
  const filteredProducts = products.filter(
    (product) => product.gender === 'mujer'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Mujeres - Ver Todo"
    />
  );
}
