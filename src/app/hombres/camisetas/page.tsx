import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function CamisetasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'camiseta'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Camisetas"
    />
  );
}
