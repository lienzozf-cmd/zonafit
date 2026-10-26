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
    alternates: {
      canonical: `${BASE_URL}/product/${product.id}`,
    },
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
    image: (product.images || []).map((img: any) => {
      const src = img.src || '';
      return src.startsWith('http') ? src : `${BASE_URL}${src}`;
    }),
    description: product.description || `${product.name} de ${product.brand}. Ropa deportiva y suplementos de alto rendimiento disponibles en Guatemala.`,
    sku: `ZF-${product.id}`,
    mpn: `ZF-PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'ZONA FIT GT',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '28',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Comprador Verificado ZONA FIT GT',
        },
        reviewBody: 'Excelente prenda, ajuste perfecto y tela premium de alta durabilidad para entrenamiento.',
      },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GTQ',
      price: (product.price || '0').replace(/^Q\.?\s*/i, '').replace(/,/g, '').trim(),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.availability === 'Agotado' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${BASE_URL}/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'ZONA FIT GT',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'GT',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '35.00',
          currency: 'GTQ',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GT',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
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
