import '@/lib/ssr-polyfills';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';
import BackgroundMusic from '@/components/background-music';
import AnalyticsTracker from '@/components/analytics-tracker';
import MetaPixel from '@/components/meta-pixel';
import CookieConsent from '@/components/cookie-consent';
import MouseTrail from '@/components/mouse-trail';
import CarbonFiberBackground from '@/components/carbon-fiber-background';

import { SITE_URL as siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ZonaFitGT | Ropa de gym en Guatemala, YoungLA y Gymshark',
    template: '%s | ZONA FIT GT',
  },
  description: 'Compra ropa de gym en Guatemala en ZonaFitGT: YoungLA, Gymshark, DFYNE, compresión, oversize y diseños de anime, Superman y Batman. Precios en quetzales y envío nacional.',
  keywords: [
    'ropa de gym',
    'ropa de gym guatemala',
    'ropa de gimnasio',
    'ropa deportiva gym',
    'playeras de compresion',
    'camisetas de compresion',
    'youngla guatemala',
    'gymshark guatemala',
    'darc sport guatemala',
    'dfyne guatemala',
    'ropa fitness hombre',
    'ropa fitness mujer',
    'shorts de gym',
    'sudaderas gym oversize',
    'suplementos gym guatemala',
    'creatina guatemala',
    'proteina whey guatemala',
    'tienda fitness guatemala',
    'zona fit gt'
  ],
  authors: [{ name: 'ZONA FIT GT' }],
  creator: 'ZONA FIT GT',
  publisher: 'ZONA FIT GT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: 'ZONA FIT GT | Tienda de Ropa de Gym y Suplementos en Guatemala',
    description: 'Encuentra las mejores marcas de ropa de gym: YoungLA, Gymshark, Darc Sport, RAW y suplementos de alto rendimiento con envíos a toda Guatemala.',
    url: siteUrl,
    siteName: 'ZONA FIT GT',
    locale: 'es_GT',
    type: 'website',
    images: [
      {
        url: '/assets/images/logos/logo.webp',
        width: 800,
        height: 800,
        alt: 'ZONA FIT GT - Tienda de Ropa de Gym en Guatemala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZONA FIT GT | Tienda de Ropa de Gym en Guatemala',
    description: 'Ropa de gym exclusiva, playeras de compresión y suplementos originales en Guatemala. YoungLA, Gymshark, Darc Sport, RAW.',
    images: ['/assets/images/logos/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': `${siteUrl}/#store`,
      name: 'ZonaFitGT',
      alternateName: ['ZONA FIT GT', 'Zona Fit GT', 'zonafitgt'],
      sameAs: ['https://www.instagram.com/zonafitgt_/', 'https://www.tiktok.com/@zonafitgt_'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+50237331442', contactType: 'customer service', availableLanguage: 'es', areaServed: 'GT' },
      url: siteUrl,
      logo: `${siteUrl}/assets/images/logos/logo.webp`,
      image: `${siteUrl}/assets/images/logos/logo.webp`,
      description: 'Tienda online especializada en ropa de gym, compresión, accesorios y suplementación deportiva premium en Guatemala.',
      currenciesAccepted: 'GTQ',
      paymentAccepted: 'Cash, Bank Transfer, Deposit',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'GT',
        addressRegion: 'Guatemala',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Guatemala',
      },

    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'ZONA FIT GT',
      description: 'Tienda de Ropa de Gym y Suplementos en Guatemala',
      publisher: {
        '@id': `${siteUrl}/#store`,
      },
      inLanguage: 'es-GT',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-GT">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="relative min-h-screen">
        <CarbonFiberBackground />
        <MetaPixel />
        <AnalyticsTracker />
        <MouseTrail />
        <div className="relative z-10">
          <IntroWrapper>{children}</IntroWrapper>
        </div>
        <BackgroundMusic />
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
