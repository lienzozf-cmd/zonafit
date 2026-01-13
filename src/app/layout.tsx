
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';

export const metadata: Metadata = {
  title: 'ZONA FIT GT',
  description: 'Tu tienda de ropa deportiva, suplementos y accesorios para gym en Guatemala. Mejora tu rendimiento con los mejores productos de fitness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      </head>
      <body>
        <IntroWrapper>{children}</IntroWrapper>
        <Toaster />
      </body>
    </html>
  );
}
