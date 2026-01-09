import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function MaletasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'maleta'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Maletas"
    />
  );
}
