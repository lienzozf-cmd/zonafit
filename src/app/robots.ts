import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // Advisory exclusions; enforced traffic blocking belongs in the firewall.
    rules: [
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'CCBot', 'Bytespider'], disallow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/checkout'] },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
