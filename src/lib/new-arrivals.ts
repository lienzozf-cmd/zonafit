import type { Product } from './data';

export const NEW_ARRIVAL_IDS = [9112, 9113, 9114, 9115];

const imagePaths: Record<string, string> = {
  '/assets/images/marcas/gymshark/hombre/devantblack.jpg': '/assets/images/new-arrivals/devant-black.webp',
  '/assets/images/marcas/gymshark/hombre/devantblack.webp': '/assets/images/new-arrivals/devant-black.webp',
  '/assets/images/marcas/gymshark/hombre/devantblue.webp': '/assets/images/new-arrivals/devant-blue.webp',
  '/assets/images/marcas/gymshark/hombre/devantlongblue.webp': '/assets/images/new-arrivals/devant-longsleeve-blue.webp',
  '/assets/images/marcas/gymshark/mujer/onyxtank.webp': '/assets/images/new-arrivals/onyx-tank.webp',
};

// Normalize both the local catalog and live Supabase data without touching stock.
export function normalizeNewArrival(product: Product): Product {
  if (!NEW_ARRIVAL_IDS.includes(Number(product.id))) return product;
  return {
    ...product,
    is_new: true,
    images: product.images.map(image => ({ ...image, src: imagePaths[image.src] || image.src })),
    colors: product.colors?.map(color => ({ ...color, imageSrc: imagePaths[color.imageSrc] || color.imageSrc })),
  };
}
