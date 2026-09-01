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

    // Intro should ONLY ever play on the root home page ('/') and only once
    if (pathname !== '/') {
      setIntroFinished(true);
      return;
    }

    try {
      if (localStorage.getItem('introShown') || sessionStorage.getItem('introShown')) {
        setIntroFinished(true);
      } else {
        setIntroFinished(false);
      }
    } catch (error) {
      setIntroFinished(true);
    }
  }, [sessionId, setSessionId, fetchProducts, pathname]);

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
