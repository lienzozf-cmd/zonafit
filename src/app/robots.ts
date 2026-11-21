import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // Search and AI search crawlers can read public catalog pages.
    // This does not request model training or guarantee search inclusion.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/checkout'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
