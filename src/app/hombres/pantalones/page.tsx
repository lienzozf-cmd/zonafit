import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function PantalonesPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && (product.subcategory === 'pantalon' || product.subcategory === 'jogger')
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Pants"
    />
  );
}
