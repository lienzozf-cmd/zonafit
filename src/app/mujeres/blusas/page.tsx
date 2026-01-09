import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function BlusasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'mujer' && product.subcategory === 'blusa'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Mujeres - Blusas"
    />
  );
}
