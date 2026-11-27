import type { Product } from './data';

const animeKeywords = [
  'inosuke', 'tanjiro', 'nezuko', 'zenitsu', 'uzui', 
  'yu-gi-oh', 'itachi', 'gojo', 'sukuna', 'anime',
  'jujutsu kaisen', 'demon slayer', 'mago oscuro',
  'dark magician', 'blue eyes', 'gogeta', 'broly',
  'aot', 'attack on titan', 'shingeki', 'levi'
];

// A shirt without compression is not necessarily oversized. Only explicit
// cut information or a reviewed manufacturer specification qualifies it.
// YoungLA: /products/4156, /products/4064, /products/4266, /products/4297.
const verifiedOversizeIds = new Set([2614, 2708, 9106, 9107]);
const isShirt = (p: Product) => p.category === 'ropa' && ['playera', 'camiseta', 'tank'].includes(p.subcategory);
const forMen = (p: Product) => p.category === 'ropa' && ['hombre', 'unisex'].includes(p.gender);
const forWomen = (p: Product) => p.category === 'ropa' && ['mujer', 'unisex'].includes(p.gender);
const isCompression = (p: Product) => isShirt(p) &&
  (p.is_compression === true || /\b(compresion|compresión|compression)\b/i.test(p.name));
const isOversize = (p: Product) => isShirt(p) && p.subcategory !== 'tank' && !isCompression(p) && (
  verifiedOversizeIds.has(p.id) ||
  /\b(oversized?|supersized)\b/i.test([p.name, p.description, p.feature1, p.feature2, p.feature3, p.feature4].join(' '))
);
const inSubcategory = (category: Product['category'], ...subcategories: string[]) =>
  (p: Product) => p.category === category && subcategories.includes(p.subcategory);

export const categoryFilters: Record<string, (p: Product) => boolean> = {
  // Clothing uses both garment type and gender, including unisex garments.
  'hombres': forMen,
  'hombres-playeras': (p) => forMen(p) && isShirt(p),
  'hombres-tanks': (p) => forMen(p) && p.subcategory === 'tank',
  'hombres-compresion': (p) => forMen(p) && isCompression(p),
  'hombres-oversize': (p) => forMen(p) && isOversize(p),
  'hombres-camisetas': (p) => forMen(p) && isShirt(p) && p.subcategory !== 'tank' && !isCompression(p) && !isOversize(p),
  'hombres-shorts': (p) => forMen(p) && p.subcategory === 'short',
  'hombres-pants': (p) => forMen(p) && ['pantalon', 'jogger'].includes(p.subcategory),
  'hombres-sudaderas': (p) => forMen(p) && ['sudadera', 'chamarra'].includes(p.subcategory),
  'hombres-chamarras': (p) => forMen(p) && p.subcategory === 'chamarra',
  'hombres-zapatos': (p) => forMen(p) && p.subcategory === 'zapato',

  'mujeres': forWomen,
  'mujeres-blusas': (p) => forWomen(p) && ['blusa', 'top', 'bras-deportivo', 'playera', 'camiseta', 'tank'].includes(p.subcategory),
  'mujeres-tops': (p) => forWomen(p) && ['top', 'blusa', 'playera', 'camiseta', 'tank'].includes(p.subcategory),
  'mujeres-bras': (p) => forWomen(p) && p.subcategory === 'bras-deportivo',
  'mujeres-enterizos': (p) => forWomen(p) && p.subcategory === 'enterizo',
  'mujeres-leggings': (p) => forWomen(p) && p.subcategory === 'legging',
  'mujeres-shorts': (p) => forWomen(p) && p.subcategory === 'short',
  'mujeres-sudaderas': (p) => forWomen(p) && ['sudadera', 'chamarra'].includes(p.subcategory),
  'mujeres-chamarras': (p) => forWomen(p) && p.subcategory === 'chamarra',
  'mujeres-pants': (p) => forWomen(p) && ['pantalon', 'jogger'].includes(p.subcategory),

  // Exact metadata prevents incidental words from creating false matches.
  'accesorios': (p) => p.category === 'accesorio',
  'accesorios-pachones-shakers': inSubcategory('accesorio', 'pachon', 'shaker'),
  'accesorios-pachones': inSubcategory('accesorio', 'pachon'),
  'accesorios-shakers': inSubcategory('accesorio', 'shaker'),
  'accesorios-equipo': inSubcategory('accesorio', 'equipo'),
  'accesorios-llaveros': inSubcategory('accesorio', 'llavero'),
  'accesorios-gorras': inSubcategory('accesorio', 'gorra'),
  'accesorios-mochilas-maletas': inSubcategory('accesorio', 'mochila', 'maleta'),
  'accesorios-mochilas': inSubcategory('accesorio', 'mochila'),
  'accesorios-maletas': inSubcategory('accesorio', 'maleta'),
  'accesorios-calcetines': inSubcategory('accesorio', 'calcetin', 'calcetines'),

  'suplementos': (p) => p.category === 'suplemento',
  'suplementos-proteinas': inSubcategory('suplemento', 'proteina'),
  'suplementos-creatinas': inSubcategory('suplemento', 'creatina'),
  'suplementos-pre-entrenos': inSubcategory('suplemento', 'pre-entreno'),
  'suplementos-aminoacidos': inSubcategory('suplemento', 'aminoacidos', 'aminoácidos'),
  'suplementos-l-carnitina': inSubcategory('suplemento', 'l-carnitina', 'carnitina'),
  'suplementos-control-peso': inSubcategory('suplemento', 'control-peso'),
  'suplementos-bienestar': inSubcategory('suplemento', 'bienestar'),

  'joyeria': (p) => p.category === 'joyeria',
  'joyeria-rgmnt': inSubcategory('joyeria', 'rgmnt'),

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
  'coleccion-batman': (p) => /batman/i.test(`${p.name} ${p.description || ''}`),
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
