import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { loadPublicCatalog } from './public-catalog';
import { products } from './data';

const readCatalog = unstable_cache(loadPublicCatalog, ['public-seo-catalog-v1'], { revalidate: 60 });

export const getSeoCatalog = cache(async () => {
  try {
    return { products: await readCatalog(), live: true };
  } catch {
    // Keep pages readable during a database outage, but omit unverified offers.
    console.warn('SEO catalog unavailable; rendering the local catalog without live offers.');
    return { products: products.filter(p => p.visible !== false), live: false };
  }
});
