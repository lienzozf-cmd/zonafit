import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';

export default function EquipoEntrenamientoPage() {
  const filteredProducts = products.filter(
    (product) =>
      product.category === 'accesorio' && product.subcategory === 'equipo'
  );

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Accesorios - Equipo de Entrenamiento"
    />
  );
}
