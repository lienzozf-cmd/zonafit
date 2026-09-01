import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function SupermanCollectionPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'ropa' &&
      (product.name.toLowerCase().includes('superman') ||
        product.description?.toLowerCase().includes('superman'))
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="⚡ Colección Superman - 10% de Descuento ⚡"
      hideBrandFilter={false}
    />
  );
}
