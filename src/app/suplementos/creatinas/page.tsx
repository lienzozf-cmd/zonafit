import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function CreatinasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'suplemento' && product.subcategory === 'creatina'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Suplementos - Creatinas"
    />
  );
}
