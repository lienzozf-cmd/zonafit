import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';

export const metadata: Metadata = {
  title: 'ZONA FIT GT',
  description: 'Gymshark, Youngla, suplementos y accesorios para gym en Guatemala.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <IntroWrapper>{children}</IntroWrapper>
        <Toaster />
      </body>
    </html>
  );
}
