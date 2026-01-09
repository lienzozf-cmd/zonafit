import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function GorrasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'gorra'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Gorras"
    />
  );
}
