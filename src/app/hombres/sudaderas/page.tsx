import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function SudaderasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'sudadera'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Sudaderas"
    />
  );
}
