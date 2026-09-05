'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { products as localProducts, type Product, isProductAvailable } from '@/lib/data';
import ProductGridPage from '@/components/product-grid-page';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';

function matchesGarmentType(product: Product, type: string): boolean {
  const name = product.name.toLowerCase();
  const subcategory = (product.subcategory || '').toLowerCase();
  
  if (type === 'compression') {
    return !!product.is_compression || 
           subcategory === 'compresion' || 
           subcategory === 'bras-deportivo' ||
           name.includes('compression') || 
           name.includes('compresión') ||
           name.includes('tight') ||
           name.includes('seamless') ||
           name.includes('bra');
  }
  if (type === 'hoodie') {
    return subcategory === 'sudaderas' || 
           subcategory === 'chamarra' || 
           subcategory === 'chamarras' || 
           name.includes('hoodie') || 
           name.includes('sudadera') || 
           name.includes('chamarra') || 
           name.includes('crewneck') || 
           name.includes('pullover');
  }
  if (type === 'pants') {
    return subcategory === 'pantalones' || 
           subcategory === 'leggings' || 
           subcategory === 'pantalon' || 
           name.includes('pants') || 
           name.includes('jogger') || 
           name.includes('legging') || 
           name.includes('pantalón');
  }
  if (type === 'shorts') {
    return subcategory === 'shorts' || 
           subcategory === 'short' || 
           name.includes('shorts') || 
           name.includes('short');
  }
  if (type === 'oversize') {
    return subcategory === 'playera' || 
           subcategory === 'blusas' || 
           subcategory === 'top' || 
           subcategory === 'tops' || 
           subcategory === 'tanks' || 
           name.includes('tee') || 
           name.includes('shirt') || 
           name.includes('tank') || 
           name.includes('playera') || 
           name.includes('blusa') || 
           name.includes('top');
  }
  return false;
}

function getProductMatchedTypes(product: Product): ('compression' | 'hoodie' | 'pants' | 'shorts' | 'oversize')[] {
  const matched: ('compression' | 'hoodie' | 'pants' | 'shorts' | 'oversize')[] = [];
  if (matchesGarmentType(product, 'compression')) matched.push('compression');
  if (matchesGarmentType(product, 'hoodie')) matched.push('hoodie');
  if (matchesGarmentType(product, 'pants')) matched.push('pants');
  if (matchesGarmentType(product, 'shorts')) matched.push('shorts');
  if (matchesGarmentType(product, 'oversize')) matched.push('oversize');
  return matched;
}

function RecomendacionesContent() {
  const searchParams = useSearchParams();
  const gender = (searchParams.get('gender') || 'hombre') as 'hombre' | 'mujer';
  const selectedType = (searchParams.get('selectedType') || 'compression') as 'compression' | 'hoodie' | 'pants' | 'shorts' | 'oversize';
  
  const sizes = useMemo(() => ({
    compression: searchParams.get('compression') || searchParams.get('size') || 'M',
    hoodie: searchParams.get('hoodie') || searchParams.get('size') || 'M',
    pants: searchParams.get('pants') || searchParams.get('size') || 'M',
    shorts: searchParams.get('shorts') || searchParams.get('size') || 'M',
    oversize: searchParams.get('oversize') || searchParams.get('size') || 'M',
  }), [searchParams]);

  const storeProducts = useCartStore((state) => state.products);
  const getProductOption = useCartStore((state) => state.getProductOption);
  const sessionId = useCartStore((state) => state.sessionId);

  const allProducts = useMemo(() => {
    return storeProducts && storeProducts.length > 0 ? storeProducts : localProducts;
  }, [storeProducts]);

  // Check if size option exists (even if stock is 0, so we show it as Out of Stock instead of hiding it)
  const hasSizeOption = (product: Product, sizeToCheck: string) => {
    if (product.colors && product.colors.length > 0) {
      return product.colors.some(c => 
        c.options?.values?.some(v => v.value === sizeToCheck)
      );
    }
    if (product.options && product.options.values) {
      return product.options.values.some(v => v.value === sizeToCheck);
    }
    return false;
  };

  const garmentLabels: Record<string, string> = {
    compression: 'Playeras de Compresión',
    hoodie: 'Hoodies y Sudaderas',
    pants: 'Pants y Leggings',
    shorts: 'Shorts',
    oversize: 'Playeras Oversize / Regular'
  };

  const checkIsAvailable = (p: Product) => {
    if (p.availability === 'Agotado') return false;
    if (p.colors && p.colors.length > 0) {
      return p.colors.some(c =>
        (c.options?.values || []).some(v => (getProductOption(p.id, v.value, c.name)?.stock ?? 0) > 0)
      );
    }
    return (p.options?.values || []).some(v => (getProductOption(p.id, v.value)?.stock ?? 0) > 0);
  };

  // Grouped products
  const primaryProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (product.category !== 'ropa' || product.gender !== gender || product.visible === false) return false;
      const matches = matchesGarmentType(product, selectedType);
      if (!matches) return false;
      return hasSizeOption(product, sizes[selectedType]);
    }).sort((a, b) => {
      const aAvailable = checkIsAvailable(a);
      const bAvailable = checkIsAvailable(b);
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      return 0;
    });
  }, [allProducts, gender, selectedType, sizes, getProductOption]);

  const otherProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (product.category !== 'ropa' || product.gender !== gender || product.visible === false) return false;
      
      const matchedTypes = getProductMatchedTypes(product);
      if (matchedTypes.length === 0 || matchedTypes.includes(selectedType)) return false;
      
      // Check if it has the recommended size for its primary matched type
      const primaryType = matchedTypes[0];
      return hasSizeOption(product, sizes[primaryType]);
    }).sort((a, b) => {
      const aAvailable = checkIsAvailable(a);
      const bAvailable = checkIsAvailable(b);
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      return 0;
    });
  }, [allProducts, gender, selectedType, sizes, getProductOption]);

  return (
    <>
      <Header />
      <main className="bg-transparent text-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter uppercase">
              Tu Recomendación de <span className="text-red-600">Ajuste Perfecto</span>
            </h1>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Prendas seleccionadas a tu medida para {gender === 'hombre' ? 'Hombres' : 'Mujeres'}.
            </p>
          </div>

          {/* Primary Selection Section */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase italic">
                {garmentLabels[selectedType] || 'Prendas'} en Talla <span className="text-red-500 font-black">{sizes[selectedType]}</span>
              </h2>
              <div className="h-px flex-grow bg-red-600/30" />
            </div>
            
            {primaryProducts.length > 0 ? (
              <div className="product-grid">
                {primaryProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    sessionId={sessionId}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-500 text-sm">
                No hay stock disponible en este momento para {garmentLabels[selectedType]} en talla {sizes[selectedType]}.
              </div>
            )}
          </div>

          {/* Other Recommendations Section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/70 uppercase italic">
                Otras Prendas Recomendadas para Ti
              </h2>
              <div className="h-px flex-grow bg-zinc-800" />
            </div>

            {otherProducts.length > 0 ? (
              <div className="product-grid">
                {otherProducts.map((product, index) => {
                  const matchedTypes = getProductMatchedTypes(product);
                  const type = matchedTypes[0] || 'oversize';
                  const recommendedSizeForType = sizes[type];
                  return (
                    <div key={product.id} className="relative group">
                      {/* Badge showing the size for this specific category */}
                      <span className="absolute top-3 right-3 z-20 bg-black/90 border border-red-600/40 text-red-500 font-mono font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                        Talla {recommendedSizeForType}
                      </span>
                      <ProductCard
                        product={product}
                        sessionId={sessionId}
                        index={index}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-500 text-sm">
                No hay otras recomendaciones disponibles en este momento.
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RecomendacionesPage() {
  return (
    <div className="bg-black min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen text-white bg-black font-bold uppercase italic tracking-widest">
          Cargando Recomendaciones...
        </div>
      }>
        <RecomendacionesContent />
      </Suspense>
    </div>
  );
}
