import type { Product } from './data';

const animeKeywords = [
  'inosuke', 'tanjiro', 'nezuko', 'zenitsu', 'uzui', 
  'yu-gi-oh', 'itachi', 'gojo', 'sukuna', 'anime',
  'jujutsu kaisen', 'demon slayer', 'mago oscuro',
  'dark magician', 'blue eyes', 'gogeta', 'broly',
  'aot', 'attack on titan', 'shingeki', 'levi'
];

export const categoryFilters: Record<string, (p: Product) => boolean> = {
  // HOMBRES
  'hombres': (p) => (p.gender === 'hombre' || p.gender === 'unisex') && p.category === 'ropa',
  'hombres-playeras': (p) => p.gender === 'hombre' && (p.subcategory === 'playera' || p.subcategory === 'tank' || p.subcategory === 'camiseta'),
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
  'hombres-camisetas': (p) => p.gender === 'hombre' && (p.subcategory === 'playera' || p.subcategory === 'camiseta'),
  'hombres-chamarras': (p) => p.gender === 'hombre' && p.subcategory === 'chamarra',
  'hombres-zapatos': (p) => p.gender === 'hombre' && p.subcategory === 'zapato',

  // MUJERES
  'mujeres': (p) => p.gender === 'mujer',
  'mujeres-blusas': (p) => p.gender === 'mujer' && (p.subcategory === 'blusa' || p.subcategory === 'top' || p.subcategory === 'bras-deportivo'),
  'mujeres-tops': (p) => p.gender === 'mujer' && (p.subcategory === 'top' || p.name.toLowerCase().includes('top') || p.subcategory === 'blusa'),
  'mujeres-bras': (p) => p.gender === 'mujer' && (p.subcategory === 'bras-deportivo' || p.name.toLowerCase().includes('bra')),
  'mujeres-leggings': (p) => p.gender === 'mujer' && p.subcategory === 'legging',
  'mujeres-shorts': (p) => p.gender === 'mujer' && p.subcategory === 'short',
  'mujeres-sudaderas': (p) => p.gender === 'mujer' && (p.subcategory === 'sudadera' || p.subcategory === 'chamarra'),
  'mujeres-chamarras': (p) => p.gender === 'mujer' && p.subcategory === 'chamarra',
  'mujeres-pants': (p) => p.gender === 'mujer' && (p.subcategory === 'pantalon' || p.subcategory === 'jogger'),

  // ACCESORIOS
  'accesorios': (p) => p.category === 'accesorio',
  'accesorios-pachones-shakers': (p) => p.category === 'accesorio' && (
    p.subcategory === 'pachon' ||
    p.subcategory === 'shaker' ||
    p.name.toLowerCase().includes('shaker') ||
    p.name.toLowerCase().includes('pachon') ||
    p.name.toLowerCase().includes('pachón') ||
    p.name.toLowerCase().includes('botella') ||
    p.name.toLowerCase().includes('cup')
  ),
  'accesorios-pachones': (p) => p.category === 'accesorio' && (
    p.subcategory === 'pachon' ||
    ((p.name.toLowerCase().includes('pachon') || p.name.toLowerCase().includes('pachón') || p.name.toLowerCase().includes('botella')) && !p.name.toLowerCase().includes('shaker'))
  ),
  'accesorios-shakers': (p) => p.category === 'accesorio' && (
    p.subcategory === 'shaker' ||
    p.name.toLowerCase().includes('shaker')
  ),
  'accesorios-equipo': (p) => p.category === 'accesorio' && (
    p.subcategory === 'equipo' ||
    p.name.toLowerCase().includes('strap') ||
    p.name.toLowerCase().includes('wrap') ||
    p.name.toLowerCase().includes('cinturon') ||
    p.name.toLowerCase().includes('faja')
  ),
  'accesorios-gorras': (p) => p.category === 'accesorio' && (
    p.subcategory === 'gorra' ||
    p.name.toLowerCase().includes('gorra') ||
    p.name.toLowerCase().includes('beanie') ||
    p.name.toLowerCase().includes('hat') ||
    (p.name.toLowerCase().includes('cap') && !p.name.toLowerCase().includes('capucha'))
  ),
  'accesorios-mochilas-maletas': (p) => p.category === 'accesorio' && (
    p.subcategory === 'mochila' ||
    p.subcategory === 'maleta' ||
    p.name.toLowerCase().includes('mochila') ||
    p.name.toLowerCase().includes('maleta') ||
    p.name.toLowerCase().includes('bag') ||
    p.name.toLowerCase().includes('backpack')
  ),
  'accesorios-mochilas': (p) => p.category === 'accesorio' && (
    p.subcategory === 'mochila' ||
    p.name.toLowerCase().includes('mochila') ||
    p.name.toLowerCase().includes('backpack')
  ),
  'accesorios-maletas': (p) => p.category === 'accesorio' && (
    p.subcategory === 'maleta' ||
    p.name.toLowerCase().includes('maleta') ||
    p.name.toLowerCase().includes('gym bag') ||
    (p.name.toLowerCase().includes('bag') && !p.name.toLowerCase().includes('backpack'))
  ),
  'accesorios-calcetines': (p) => p.category === 'accesorio' && (
    p.subcategory === 'calcetin' ||
    p.subcategory === 'calcetines' ||
    p.name.toLowerCase().includes('calcetin') ||
    p.name.toLowerCase().includes('socks') ||
    p.name.toLowerCase().includes('sock')
  ),

  // SUPLEMENTOS
  'suplementos': (p) => p.category === 'suplemento',
  'suplementos-proteinas': (p) => p.category === 'suplemento' && (
    p.subcategory === 'proteina' ||
    p.name.toLowerCase().includes('proteina') ||
    p.name.toLowerCase().includes('proteína') ||
    p.name.toLowerCase().includes('protein') ||
    p.name.toLowerCase().includes('whey') ||
    p.name.toLowerCase().includes('iso')
  ),
  'suplementos-creatinas': (p) => p.category === 'suplemento' && (
    p.subcategory === 'creatina' ||
    p.name.toLowerCase().includes('creatina') ||
    p.name.toLowerCase().includes('creatine')
  ),
  'suplementos-pre-entrenos': (p) => p.category === 'suplemento' && (
    p.subcategory === 'pre-entreno' ||
    p.name.toLowerCase().includes('pre-workout') ||
    p.name.toLowerCase().includes('pump') ||
    p.name.toLowerCase().includes('glycerol') ||
    p.name.toLowerCase().includes('venom')
  ),
  'suplementos-aminoacidos': (p) => p.category === 'suplemento' && (
    p.subcategory === 'aminoacidos' ||
    p.subcategory === 'aminoácidos' ||
    p.name.toLowerCase().includes('amino') ||
    p.name.toLowerCase().includes('bcaa') ||
    p.name.toLowerCase().includes('eaa') ||
    p.name.toLowerCase().includes('glutamin') ||
    p.name.toLowerCase().includes('sleep') ||
    p.name.toLowerCase().includes('omega')
  ),
  'suplementos-l-carnitina': (p) => p.category === 'suplemento' && (
    p.subcategory === 'l-carnitina' ||
    p.subcategory === 'carnitina' ||
    p.name.toLowerCase().includes('carnitin')
  ),

  // JOYERIA
  'joyeria': (p) => p.category === 'joyeria',
  'joyeria-rgmnt': (p) => p.category === 'joyeria' && (p.subcategory === 'rgmnt' || p.brand === 'RGMNT'),

  // COLECCIONES
  'anime': (p) => {
    const nameLower = (p.name || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const matchesKeyword = animeKeywords.some(k => nameLower.includes(k) || descLower.includes(k));
    if (matchesKeyword) return true;
    if (p.images && p.images.length > 0) {
      return p.images.some(img => (img.dataAiHint || '').toLowerCase().includes('anime'));
    }
    return false;
  },
  'coleccion-superman': (p) => {
    const nameLower = (p.name || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    return nameLower.includes('superman') || descLower.includes('superman');
  },
};

export const filterProductsByCategory = (products: Product[], categoryKey?: string): Product[] => {
  if (!categoryKey) return products;
  const filterFn = categoryFilters[categoryKey];
  if (!filterFn) {
    console.warn(`[category-filters] No filter found for "${categoryKey}"`);
    return [];
  }
  return products.filter(filterFn);
};
