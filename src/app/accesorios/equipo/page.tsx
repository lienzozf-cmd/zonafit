import ProductGridPage from '@/components/product-grid-page';
import { products } from '@/lib/data';
import { filterProductsByCategory } from '@/lib/category-filters';

export default function EquipoEntrenamientoPage() {
  const filteredProducts = filterProductsByCategory(products, 'accesorios-equipo');

  return (
    <ProductGridPage
      products={filteredProducts}
      categoryKey="accesorios-equipo"
      title="Accesorios - Equipo de Entrenamiento"
    />
  );
}
