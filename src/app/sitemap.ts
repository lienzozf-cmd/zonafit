import { MetadataRoute } from 'next';
import productsData from '@/lib/products.json';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zonafitgt.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Core pages
  const coreRoutes = [
    { url: `${BASE_URL}`, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/playeras`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/playeras/compresion`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/playeras/oversize`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/playeras/tanks`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/shorts`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/sudaderas`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hombres/pantalones`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/mujeres`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/mujeres/tops`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/mujeres/leggings`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/mujeres/shorts`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/mujeres/sudaderas`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/suplementos`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/suplementos/creatinas`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/suplementos/proteinas`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/suplementos/pre-entrenos`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/accesorios`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/joyeria`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/anime`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/coleccion/spiderman`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/coleccion/demon-slayer`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/coleccion/superman`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/marcas`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/youngla`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/gymshark`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/darc-sport`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/dragon-pharma`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/raw`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/dfyne`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/vanquish`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/marcas/bum-energy`, priority: 0.8, changeFrequency: 'weekly' as const },
  ].map(route => ({
    url: route.url,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Dynamic Product pages
  const productRoutes = (productsData || [])
    .filter((p: any) => p.visible !== false)
    .map((p: any) => ({
      url: `${BASE_URL}/product/${p.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...coreRoutes, ...productRoutes];
}
