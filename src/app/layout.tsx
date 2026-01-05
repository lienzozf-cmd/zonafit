
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';

export const metadata: Metadata = {
  title: 'ZONA FIT GT',
  description: 'Tu tienda integral de ropa, suplementos y accesorios de fitness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/assets/images/logos/minilogo.png" sizes="any" />
      </head>
      <body>
        <IntroWrapper>{children}</IntroWrapper>
        <Toaster />
      </body>
    </html>
  );
}
