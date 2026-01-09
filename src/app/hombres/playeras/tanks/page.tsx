import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function TanksPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'tank'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Tanks"
    />
  );
}
