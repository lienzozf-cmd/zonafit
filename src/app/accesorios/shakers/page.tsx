import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function ShakersPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'shaker'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Shakers"
    />
  );
}
