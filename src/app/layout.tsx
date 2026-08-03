import '@/lib/ssr-polyfills';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';
import BackgroundMusic from '@/components/background-music';
import AnalyticsTracker from '@/components/analytics-tracker';
import CookieConsent from '@/components/cookie-consent';

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
        <AnalyticsTracker />
        <IntroWrapper>{children}</IntroWrapper>
        <BackgroundMusic />
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
