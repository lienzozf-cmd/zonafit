import type { Product } from './data';

export const categoryFilters: Record<string, (p: Product) => boolean> = {
  'hombres': (p) => (p.gender === 'hombre' || p.gender === 'unisex') && p.category === 'ropa',
  'hombres-playeras': (p) => p.gender === 'hombre' && (p.subcategory === 'playera' || p.subcategory === 'tank'),
  'hombres-tanks': (p) => p.gender === 'hombre' && (
    p.subcategory === 'tank' ||
    p.name.toLowerCase().includes('tank') ||
    p.name.toLowerCase().includes('cut-off') ||
    p.name.toLowerCase().includes('cut off') ||
    p.name.toLowerCase().includes('stringer') ||
    p.name.toLowerCase().includes('wife lover')
  ),
  'hombres-compresion': (p) => p.gender === 'hombre' &&
    (p.is_compression === true || p.name.toLowerCase().includes('compression') || p.name.toLowerCase().includes('compresión')) &&
    (p.subcategory === 'playera' || p.subcategory === 'tank'),
  'hombres-oversize': (p) => p.gender === 'hombre' &&
    p.subcategory === 'playera' &&
    !p.is_compression &&
    !p.name.toLowerCase().includes('compression') &&
    !p.name.toLowerCase().includes('compresión'),
  'hombres-shorts': (p) => p.gender === 'hombre' && p.subcategory === 'short',
  'hombres-pants': (p) => p.gender === 'hombre' && (p.subcategory === 'pantalon' || p.subcategory === 'jogger'),
  'hombres-sudaderas': (p) => (p.gender === 'hombre' || p.gender === 'unisex') && p.subcategory === 'sudadera',

  'mujeres': (p) => p.gender === 'mujer',
  'mujeres-blusas': (p) => p.gender === 'mujer' && (p.subcategory === 'blusa' || p.subcategory === 'top' || p.subcategory === 'bras-deportivo'),
  'mujeres-tops': (p) => p.gender === 'mujer' && (p.subcategory === 'top' || p.name.toLowerCase().includes('top') || p.subcategory === 'blusa'),
  'mujeres-bras': (p) => p.gender === 'mujer' && (p.subcategory === 'bras-deportivo' || p.name.toLowerCase().includes('bra')),
  'mujeres-leggings': (p) => p.gender === 'mujer' && p.subcategory === 'legging',
  'mujeres-shorts': (p) => p.gender === 'mujer' && p.subcategory === 'short',
  'mujeres-sudaderas': (p) => p.gender === 'mujer' && (p.subcategory === 'sudadera' || p.subcategory === 'chamarra'),
  'mujeres-chamarras': (p) => p.gender === 'mujer' && p.subcategory === 'chamarra',
  'mujeres-pants': (p) => p.gender === 'mujer' && (p.subcategory === 'pantalon' || p.subcategory === 'jogger'),

  'accesorios-equipo': (p) => p.category === 'accesorio' && (
    p.subcategory === 'equipo' ||
    p.name.toLowerCase().includes('strap') ||
    p.name.toLowerCase().includes('wrap')
  ),
  'suplementos-pre-entrenos': (p) => p.category === 'suplemento' && (
    p.subcategory === 'pre-entreno' ||
    p.name.toLowerCase().includes('pre-workout') ||
    p.name.toLowerCase().includes('pump') ||
    p.name.toLowerCase().includes('glycerol') ||
    p.name.toLowerCase().includes('venom')
  ),
  'joyeria-rgmnt': (p) => p.category === 'joyeria' && (p.subcategory === 'rgmnt' || p.brand === 'RGMNT'),
};

export const filterProductsByCategory = (products: Product[], categoryKey?: string): Product[] => {
  if (!categoryKey || !categoryFilters[categoryKey]) return products;
  return products.filter(categoryFilters[categoryKey]);
};
