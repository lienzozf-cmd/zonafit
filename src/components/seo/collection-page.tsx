import ProductGridPage from '@/components/product-grid-page';
import { collections, absoluteUrl, serializeJsonLd } from '@/lib/seo';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { filterProductsByCategory } from '@/lib/category-filters';

export default async function CollectionPage({ path }: { path: string }) {
  const entry = collections.find(item => item.path === path);
  if (!entry) throw new Error(`Unknown collection: ${path}`);
  const { products } = await getSeoCatalog();
  const filtered = entry.brand
    ? products.filter(product => product.brand.toLowerCase() === entry.brand!.toLowerCase())
    : filterProductsByCategory(products, entry.categoryKey);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        '@id': absoluteUrl(path), url: absoluteUrl(path), name: entry.heading,
        description: entry.description, inLanguage: 'es-GT',
        isPartOf: { '@id': absoluteUrl('/#website') },
        mainEntity: {
          '@type': 'ItemList', numberOfItems: filtered.length,
          itemListElement: filtered.map((product, index) => ({
            '@type': 'ListItem', position: index + 1, name: product.name,
            url: absoluteUrl(`/product/${product.id}`),
          })),
        },
      }) }} />
      <ProductGridPage products={filtered} title={entry.heading} categoryKey={entry.categoryKey} hideBrandFilter={Boolean(entry.brand)} seo={entry} />
    </>
  );
}
