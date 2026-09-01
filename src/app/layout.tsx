import '@/lib/ssr-polyfills';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import IntroWrapper from '@/components/intro-wrapper';
import BackgroundMusic from '@/components/background-music';
import AnalyticsTracker from '@/components/analytics-tracker';
import CookieConsent from '@/components/cookie-consent';
import MouseTrail from '@/components/mouse-trail';

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
      <body className="relative min-h-screen">
        <div className="global-dot-matrix-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
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
