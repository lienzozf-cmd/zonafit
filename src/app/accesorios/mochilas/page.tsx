import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function MochilasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'mochila'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Mochilas"
    />
  );
}
