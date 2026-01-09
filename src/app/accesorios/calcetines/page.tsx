import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function CalcetinesPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'calcetin'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Calcetines"
    />
  );
}
