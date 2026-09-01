'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';
import { useCartStore } from '@/stores/cart-store';
import { usePathname } from 'next/navigation';

import PageTransition from './page-transition';
import SocialSection from './social-section';
import BackgroundMusic from './background-music';
import { useRealtimeStock } from '@/hooks/use-realtime-stock';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const setSessionId = useCartStore((state) => state.setSessionId);
  const sessionId = useCartStore((state) => state.sessionId);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const pathname = usePathname();

  // Activa la suscripción en tiempo real a los cambios de stock en Supabase
  useRealtimeStock();

  useEffect(() => {
    setIsClient(true);
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 11));
    }
    // Fetch products from the API
    fetchProducts();

    try {
      const alreadyShown =
        localStorage.getItem('introShown') === 'true' ||
        sessionStorage.getItem('introShown') === 'true';

      if (alreadyShown || pathname !== '/') {
        setIntroFinished(true);
        localStorage.setItem('introShown', 'true');
        sessionStorage.setItem('introShown', 'true');
      } else {
        setIntroFinished(false);
      }
    } catch (error) {
      setIntroFinished(true);
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntroFinish = () => {
    setIntroFinished(true);
    try {
      localStorage.setItem('introShown', 'true');
      sessionStorage.setItem('introShown', 'true');
    } catch (error) {
      // Handle potential errors with storage
    }
  };

  if (!isClient) {
    return null;
  }

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!introFinished ? (
        <IntroAnimation onIntroFinish={handleIntroFinish} />
      ) : (
        <PageTransition>
          {!isAdminPage && <SocialSection />}
          {children}
        </PageTransition>
      )}
    </>
  );
}
