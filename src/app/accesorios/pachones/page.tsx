import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function PachonesPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'pachon'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Pachones"
    />
  );
}
