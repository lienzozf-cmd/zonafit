import type { Metadata } from 'next';
import productsData from '@/lib/products.json';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zonafitgt.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = (productsData as any[]).find(p => String(p.id) === String(id));

  if (!product) {
    return {
      title: 'Producto no encontrado | ZONA FIT GT',
    };
  }

  const cleanPrice = product.price || '';
  const title = `${product.name} - ${product.brand} | Ropa de Gym Guatemala`;
  const description = `${product.name} de la marca ${product.brand}. ${product.description || 'Prenda y suplemento de alto rendimiento disponible en Guatemala.'} Precio: ${cleanPrice}. Envíos a todo el país.`;
  const imageUrl = product.images?.[0]?.src || '/assets/images/logos/logo.webp';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      'ropa de gym',
      'ropa de gym guatemala',
      product.category || 'ropa',
      product.subcategory || 'fitness',
      'zona fit gt'
    ],
    openGraph: {
      title: `${product.name} | ${product.brand} Guatemala`,
      description,
      url: `${BASE_URL}/product/${product.id}`,
      siteName: 'ZONA FIT GT',
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${product.brand}`,
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: Props) {
  const { id } = await params;
  const product = (productsData as any[]).find(p => String(p.id) === String(id));

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img: any) => {
      const src = img.src || '';
      return src.startsWith('http') ? src : `${BASE_URL}${src}`;
    }) || [],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GTQ',
      price: (product.price || '0').replace(/^Q\.?\s*/i, '').replace(/,/g, '').trim(),
      availability: product.availability === 'Agotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${BASE_URL}/product/${product.id}`,
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
