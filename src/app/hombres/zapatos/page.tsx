import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function ZapatosPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.gender === 'hombre' && product.subcategory === 'zapato'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Hombres - Zapatos"
    />
  );
}
