import type { Metadata } from 'next';
import { getSeoCatalog } from '@/lib/seo-catalog';
import { absoluteUrl, serializeJsonLd } from '@/lib/seo';
import { isProductAvailable } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { products } = await getSeoCatalog();
  const product = products.find(p => String(p.id) === id && p.visible !== false);
  if (!product) return { title: 'Producto no encontrado', robots: { index: false, follow: true } };
  const title = `${product.name} | ${product.brand} Guatemala`;
  const description = `${product.name} de ${product.brand}. ${product.description || ''} Precio: ${product.price}. Consulta tallas y disponibilidad. Envíos en Guatemala.`.replace(/\s+/g, ' ').slice(0, 300);
  const image = absoluteUrl(product.images?.[0]?.src || '/assets/images/logos/logo.webp');
  return {
    title, description, alternates: { canonical: `/product/${product.id}` },
    openGraph: { title, description, url: absoluteUrl(`/product/${product.id}`), type: 'website', images: [{ url: image, alt: product.name }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products, live } = await getSeoCatalog();
  const product = products.find(p => String(p.id) === id && p.visible !== false);
  const price = Number(product?.price.replace(/^Q\.?\s*/i, '').replace(/,/g, '').trim());
  const jsonLd = product ? {
    '@context': 'https://schema.org', '@type': 'Product',
    '@id': absoluteUrl(`/product/${product.id}#product`),
    name: product.name, url: absoluteUrl(`/product/${product.id}`),
    image: product.images.map(img => absoluteUrl(img.src)), description: product.description,
    sku: `ZF-${product.id}`, brand: { '@type': 'Brand', name: product.brand },
    // Only publish offers verified against the same live catalog as the rendered page.
    ...(live && Number.isFinite(price) && price > 0 ? { offers: {
      '@type': 'Offer', priceCurrency: 'GTQ', price: price.toFixed(2),
      itemCondition: 'https://schema.org/NewCondition',
      availability: isProductAvailable(product) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.id}`), seller: { '@id': absoluteUrl('/#store') },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '35.00', currency: 'GTQ' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'GT' },
      },
    } } : {}),
  } : null;
  return <>{jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}{children}</>;
}
