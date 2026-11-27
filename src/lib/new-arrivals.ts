import type { Product } from './data';

export const NEW_ARRIVAL_IDS = [9112, 9113, 9114, 9115, 9116, 9117, 9118, 9119, 9120, 9121, 9122, 9123, 9124, 9125, 9126, 9127, 9128, 9129, 9130, 9131, 9132, 9133];

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
