import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function LeggingsPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'mujer' && product.subcategory === 'legging'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Mujeres - Leggings"
    />
  );
}
