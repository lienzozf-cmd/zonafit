import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function MochilasMaletasPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && (product.subcategory === 'mochila' || product.subcategory === 'maleta')
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Mochilas y Maletas"
    />
  );
}
