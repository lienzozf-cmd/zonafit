import type { Product, ProductColor } from './data';

export type ProductCharacteristic = { tag: string; text: string };

const supplementTypes: Record<string, string> = {
  creatina: 'Creatina', proteina: 'Proteína', 'pre-entreno': 'Pre-entreno',
  aminoacidos: 'Aminoácidos', 'aminoácidos': 'Aminoácidos',
  'l-carnitina': 'L-carnitina', carnitina: 'L-carnitina',
  bienestar: 'Suplemento de bienestar', 'control-peso': 'Suplemento de control de peso',
};
const accessoryTypes: Record<string, string> = {
  shaker: 'Shaker', pachon: 'Pachón', equipo: 'Equipo de entrenamiento',
  llavero: 'Llavero', gorra: 'Gorra', mochila: 'Mochila', maleta: 'Maleta',
  calcetin: 'Calcetines', calcetines: 'Calcetines',
};

// Non-clothing facts come from the catalog name, presentation and variant data.
// Never reuse garment defaults or infer health benefits from a supplement category.
export function getProductCharacteristics(product: Product, selectedColor?: ProductColor | null): ProductCharacteristic[] {
  if (product.category === 'ropa') {
    return [
      { tag: 'SOPORTE Y AJUSTE', text: product.feature1 || 'Corte Atlético Profesional' },
      { tag: 'COMPOSICIÓN', text: product.fabric_type ? `Tela: ${product.fabric_type}` : 'Mezcla de Fibras Premium' },
      { tag: 'RENDIMIENTO', text: product.is_compression ? 'Sistema de Compresión' : 'Tejido Transpirable' },
      { tag: 'TECNOLOGÍA', text: product.feature2 || 'Costuras de Alta Resistencia' },
    ];
  }

  const features: ProductCharacteristic[] = [];
  if (product.category === 'suplemento') {
    let type = supplementTypes[product.subcategory] || 'Suplemento';
    if (/multivitamin|core series multi/i.test(product.name)) type = 'Multivitamínico';
    else if (/ashwagandha/i.test(product.name)) type = 'Extracto de ashwagandha';
    else if (/omega.?3/i.test(product.name)) type = 'Omega-3';
    else if (/melatonin/i.test(product.name)) type = 'Melatonina';
    else if (/monohydrate|monohidrat/i.test(product.name)) type = 'Creatina monohidratada';
    else if (product.subcategory === 'proteina' && /whey/i.test(product.name)) type = 'Proteína de suero de leche';
    features.push({ tag: 'TIPO DE PRODUCTO', text: type });

    const units: Record<string, string> = {
      caplets: 'capletas', tablets: 'tabletas', vcaps: 'cápsulas vegetales',
      capsules: 'cápsulas', softgels: 'cápsulas blandas',
      servings: 'servicios', serv: 'servicios', servs: 'servicios',
      g: 'g', lb: 'lb', lbs: 'lb',
    };
    const match = product.name.match(/\b(\d+(?:\.\d+)?)\s*(caplets|tablets|vcaps|capsules|softgels|servings|servs|serv|lbs|lb|g)\b/i);
    const presentation = match ? `${match[1]} ${units[match[2].toLowerCase()]}` : product.servings_info;
    if (presentation?.trim()) features.push({ tag: 'PRESENTACIÓN', text: presentation.trim() });

    const options = product.options?.values || [];
    const genericOptions = /^(único|unico|original|pack|\d+\s*serv(?:ings|s)?)$/i;
    const flavor = selectedColor?.name || product.colors?.[0]?.name ||
      (product.options?.type?.toLowerCase() === 'sabor' ? options.filter(o => !genericOptions.test(o.value)).map(o => o.value).join(' · ') : '');
    if (flavor) features.push({ tag: 'SABOR', text: flavor === 'Unflavored' ? 'Sin sabor' : flavor });

    const format = /caplets/i.test(product.name) ? 'Capletas'
      : /tablets/i.test(product.name) ? 'Tabletas'
      : /vcaps/i.test(product.name) ? 'Cápsulas vegetales'
      : /softgels/i.test(product.name) ? 'Cápsulas blandas'
      : /capsules/i.test(product.name) ? 'Cápsulas'
      : /liquid/i.test(product.name) ? 'Líquido'
      : /powder|whey/i.test(product.name) ? 'Polvo' : '';
    if (format) features.push({ tag: 'FORMATO', text: format });
    const concentration = product.name.match(/\b\d+(?:\.\d+)?\s*mg\b/i)?.[0];
    if (concentration) features.push({ tag: 'CONCENTRACIÓN', text: concentration.replace(/\s*mg/i, ' mg') });
  } else {
    features.push({ tag: 'TIPO DE PRODUCTO', text: product.category === 'joyeria' ? 'Joyería' : accessoryTypes[product.subcategory] || 'Accesorio' });
    if (selectedColor?.name) features.push({ tag: 'COLOR', text: selectedColor.name });
    if (product.fabric_type?.trim()) features.push({ tag: 'MATERIAL', text: product.fabric_type.trim() });
  }
  if (product.brand?.trim()) features.push({ tag: 'MARCA', text: product.brand.trim() });
  return features.slice(0, 4);
}
