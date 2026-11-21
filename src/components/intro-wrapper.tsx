'use client';

import { useState, useEffect, useCallback } from 'react';
import IntroAnimation from './intro-animation';
import { useCartStore } from '@/stores/cart-store';
import { usePathname } from 'next/navigation';

import PageTransition from './page-transition';
import SocialSection from './social-section';
import { useRealtimeStock } from '@/hooks/use-realtime-stock';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The server and first client render must use the same state.
  // Browser storage is read only after hydration in the effect below.
  const [showIntro, setShowIntro] = useState(pathname === '/');

  const setSessionId = useCartStore((state) => state.setSessionId);
  const sessionId = useCartStore((state) => state.sessionId);
  const fetchProducts = useCartStore((state) => state.fetchProducts);

  // Activa la suscripción en tiempo real a los cambios de stock en Supabase
  useRealtimeStock();

  useEffect(() => {
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 11));
    }

    // Eliminar el bloqueo permanente antiguo de localStorage si existía
    try {
      localStorage.removeItem('introShown');
    } catch (e) {}

    // Si ya se vio en esta sesión o no estamos en '/', no mostrar la intro
    try {
      const alreadySeen = sessionStorage.getItem('zonafit_intro_seen') === 'true';
      if (alreadySeen || pathname !== '/') {
        setShowIntro(false);
      }
    } catch (e) {}
  }, [pathname, sessionId, setSessionId]);

  // Navigation refreshes share a 30-second freshness window across all consumers.
  useEffect(() => {
    fetchProducts();
  }, [pathname, fetchProducts]);

  useEffect(() => {
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible') void fetchProducts();
    };
    document.addEventListener('visibilitychange', refreshOnReturn);
    return () => document.removeEventListener('visibilitychange', refreshOnReturn);
  }, [fetchProducts]);

  const handleIntroFinish = useCallback(() => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('zonafit_intro_seen', 'true');
    } catch (e) {}
  }, []);

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {showIntro && (
        <IntroAnimation onIntroFinish={handleIntroFinish} />
      )}
      <PageTransition>
        {!isAdminPage && <SocialSection />}
        {children}
      </PageTransition>
    </>
  );
}
