import type { Metadata } from 'next';

// SEO uses the verified public host, independently of Firebase/preview API base URLs.
export const SITE_URL = (process.env.SEO_SITE_URL || 'https://www.zonafitgt.com').replace(/\/$/, '');
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).toString();
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export type CollectionSeo = {
  path: string;
  title: string;
  heading: string;
  description: string;
  intro: string;
  categoryKey?: string;
  brand?: string;
};

export const collections: CollectionSeo[] = [
  {
    path: '/hombres', title: 'Ropa de gym para hombre en Guatemala',
    heading: 'Ropa de gym para hombre en Guatemala', categoryKey: 'hombres',
    description: 'Compra ropa para gimnasio de hombre en ZonaFitGT: playeras, shorts, tanks y sudaderas. Consulta tallas, precios en quetzales y envíos en Guatemala.',
    intro: 'Encuentra ropa para entrenar y para usar fuera del gimnasio. Compara playeras de compresión, cortes oversize, tanks, shorts y sudaderas; revisa las tallas y existencias de cada modelo antes de pedir.',
  },
  {
    path: '/mujeres', title: 'Ropa de gym para mujer en Guatemala',
    heading: 'Ropa de gym para mujer en Guatemala', categoryKey: 'mujeres',
    description: 'Explora ropa de gimnasio para mujer en ZonaFitGT: leggings, shorts, tops y bras deportivos. Precios en quetzales y envíos a Guatemala.',
    intro: 'Explora leggings, shorts, tops y bras deportivos para armar tu outfit de entrenamiento. El catálogo muestra los modelos por marca; consulta las opciones de talla y color de cada prenda.',
  },
  {
    path: '/marcas/youngla', title: 'YoungLA en Guatemala: ropa para gym',
    heading: 'YoungLA en Guatemala', brand: 'YoungLA',
    description: 'Encuentra YoungLA en ZonaFitGT Guatemala. Explora playeras, shorts y sudaderas del catálogo, revisa tallas y compra en quetzales con envío nacional.',
    intro: 'Consulta el catálogo de YoungLA en ZonaFitGT y encuentra prendas para combinar dentro y fuera del gym. Cada ficha muestra precio, fotos y opciones de talla o color; la disponibilidad depende del modelo.',
  },
  {
    path: '/marcas/gymshark', title: 'Gymshark en Guatemala: ropa de gimnasio',
    heading: 'Gymshark en Guatemala', brand: 'Gymshark',
    description: 'Compra Gymshark en Guatemala con ZonaFitGT. Consulta ropa para entrenamiento, tallas, colores, precios en quetzales y existencias por producto.',
    intro: 'Explora las prendas Gymshark del catálogo para tus entrenamientos. Revisa el ajuste, las fotos, las tallas y los colores en la ficha del producto antes de añadirlo al carrito.',
  },
  {
    path: '/marcas/dfyne', title: 'DFYNE en Guatemala: ropa de gym para mujer',
    heading: 'DFYNE en Guatemala', brand: 'DFYNE',
    description: 'Explora DFYNE en ZonaFitGT Guatemala. Consulta prendas, tallas y colores del catálogo con precios en quetzales y envíos a todo el país.',
    intro: 'Encuentra la selección de DFYNE de ZonaFitGT para tus outfits de gimnasio. Consulta las características de cada prenda y confirma la talla y el color disponibles antes de comprar.',
  },
  {
    path: '/hombres/playeras/compresion', title: 'Playeras de compresión para gym en Guatemala',
    heading: 'Playeras de compresión para gym en Guatemala', categoryKey: 'hombres-compresion',
    description: 'Compra playeras y camisetas de compresión para gimnasio en Guatemala. Compara modelos, marcas, tallas y precios en quetzales en ZonaFitGT.',
    intro: 'Las playeras de compresión tienen un ajuste ceñido al cuerpo, distinto al corte holgado de una oversize. Compara los modelos de esta selección y consulta la tela y las medidas de cada prenda para elegir tu talla.',
  },
  {
    path: '/hombres/playeras/oversize', title: 'Playeras oversize para gym en Guatemala',
    heading: 'Playeras oversize para gym en Guatemala', categoryKey: 'hombres-oversize',
    description: 'Encuentra playeras oversize y camisetas de corte relajado para gym en ZonaFitGT Guatemala. Consulta modelos, tallas y precios en quetzales.',
    intro: 'Explora playeras de corte relajado para entrenar o completar tu outfit diario. El ajuste cambia entre marcas y modelos: revisa la descripción y las medidas de cada ficha para elegir qué tan holgada quieres tu prenda.',
  },
  {
    path: '/anime', title: 'Ropa de anime para gym en Guatemala',
    heading: 'Ropa de anime para gym en Guatemala', categoryKey: 'anime',
    description: 'Explora playeras y ropa de anime para gimnasio en ZonaFitGT Guatemala. Encuentra diseños por personaje, tallas y precios en quetzales.',
    intro: 'Combina tu entrenamiento con tus personajes favoritos. Explora prendas con diseños de anime, incluida la colección Demon Slayer, y revisa el corte, las tallas y las existencias de cada modelo.',
  },
  {
    path: '/coleccion/superman', title: 'Playeras y ropa de Superman en Guatemala',
    heading: 'Playeras y ropa de Superman para gym', categoryKey: 'coleccion-superman',
    description: 'Encuentra ropa y playeras de Superman en ZonaFitGT Guatemala. Compara diseños, marcas, tallas y precios del catálogo antes de comprar.',
    intro: 'Explora las prendas con diseños de Superman disponibles en el catálogo. Consulta si el modelo tiene ajuste ceñido o relajado, revisa sus fotos y selecciona una talla con existencias.',
  },
  {
    path: '/coleccion/batman', title: 'Playeras y ropa de Batman en Guatemala',
    heading: 'Playeras y ropa de Batman para gym', categoryKey: 'coleccion-batman',
    description: 'Explora playeras y ropa de Batman en ZonaFitGT Guatemala. Consulta fotos, tallas, precios en quetzales y disponibilidad de cada modelo.',
    intro: 'Encuentra las prendas del catálogo con diseños de Batman para tu outfit de gym o de uso diario. Cada producto indica su marca, precio y opciones de talla; consulta las existencias antes de pedir.',
  },
];

export function collectionMetadata(path: string): Metadata {
  const entry = collections.find(item => item.path === path);
  if (!entry) throw new Error(`Missing collection SEO: ${path}`);
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: entry.path },
    openGraph: {
      title: `${entry.title} | ZonaFitGT`, description: entry.description,
      url: absoluteUrl(entry.path), type: 'website', locale: 'es_GT',
      images: [{ url: '/assets/images/logos/logo.webp', alt: 'ZonaFitGT — ropa de gym en Guatemala' }],
    },
    twitter: { card: 'summary_large_image', title: entry.title, description: entry.description, images: ['/assets/images/logos/logo.webp'] },
  };
}
