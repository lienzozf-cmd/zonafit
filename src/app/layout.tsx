
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';

export const metadata = {
  title: 'ZONA FIT GT',
  description: 'Your one-stop shop for fitness apparel, supplements, and accessories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
