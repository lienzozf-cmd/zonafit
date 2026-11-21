import type { MetadataRoute } from 'next';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { absoluteUrl } from '@/lib/seo';
import { sitemapRoutes } from '@/lib/sitemap-routes';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getSeoCatalog();
  // No synthetic lastModified: a crawl/build is not a content update.
  return [
    ...sitemapRoutes.map(path => ({ url: absoluteUrl(path) })),
    ...products.filter(product => product.visible !== false).map(product => ({ url: absoluteUrl(`/product/${product.id}`) })),
  ];
}
