import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function ChamarrasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'chamarra'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Chamarras"
    />
  );
}
