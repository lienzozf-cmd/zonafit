import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'ZONA FIT GT',
  description: 'Your one-stop shop for fitness apparel, supplements, and accessories.',
  icons: {
    icon: 'https://placehold.co/32x32.png',
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
