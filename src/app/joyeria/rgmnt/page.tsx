import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function RgmntPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'joyeria' && product.subcategory === 'rgmnt'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Joyería - RGMNT"
    />
  );
}
