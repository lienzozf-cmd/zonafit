import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function TopsPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'mujer' && product.subcategory === 'top'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Mujeres - Tops"
    />
  );
}
