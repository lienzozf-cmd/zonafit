
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';
import { ProductStoreProvider } from '@/providers/product-provider';

export const metadata = {
  title: 'ZONA FIT GT',
  description: 'Your one-stop shop for fitness apparel, supplements, and accessories.',
  icons: {
    icon: '/assets/images/logos/minilogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProductStoreProvider>
          <IntroWrapper>{children}</IntroWrapper>
          <Toaster />
        </ProductStoreProvider>
      </body>
    </html>
  );
}
