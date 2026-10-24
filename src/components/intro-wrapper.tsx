'use client';

import { useState, useEffect } from 'react';
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
  const [showIntro, setShowIntro] = useState(false);
  const setSessionId = useCartStore((state) => state.setSessionId);
  const sessionId = useCartStore((state) => state.sessionId);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const pathname = usePathname();

  // Activa la suscripción en tiempo real a los cambios de stock en Supabase
  useRealtimeStock();

  useEffect(() => {
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 11));
    }
    // Fetch products in background to keep stock fresh
    fetchProducts();

    // Eliminar el bloqueo permanente antiguo de localStorage si existía
    try {
      localStorage.removeItem('introShown');
    } catch (e) {}

    // Mostrar intro en la página de inicio cuando es una nueva sesión
    try {
      const alreadySeen = sessionStorage.getItem('zonafit_intro_seen');
      if (!alreadySeen && pathname === '/') {
        setShowIntro(true);
      }
    } catch (e) {
      // Fallback si sessionStorage está restringido
    }
  }, [pathname, sessionId, setSessionId, fetchProducts]);

  const handleIntroFinish = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('zonafit_intro_seen', 'true');
    } catch (e) {}
  };

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
