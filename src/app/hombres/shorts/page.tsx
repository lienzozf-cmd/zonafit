import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function ShortsPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'short'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Shorts"
    />
  );
}
