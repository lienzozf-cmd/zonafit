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
  const pathname = usePathname();

  // Para evitar que se vea el fondo o cualquier elemento antes de la intro al cargar la web,
  // la intro se inicia en true desde SSR en la ruta raíz '/', cubriendo la pantalla desde el milisegundo 0.
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        return false;
      }
      return sessionStorage.getItem('zonafit_intro_seen') !== 'true';
    } catch {
      return false;
    }
  });

  const setSessionId = useCartStore((state) => state.setSessionId);
  const sessionId = useCartStore((state) => state.sessionId);
  const fetchProducts = useCartStore((state) => state.fetchProducts);

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

    // Si ya se vio en esta sesión o no estamos en '/', no mostrar la intro
    try {
      const alreadySeen = sessionStorage.getItem('zonafit_intro_seen') === 'true';
      if (alreadySeen || pathname !== '/') {
        setShowIntro(false);
      }
    } catch (e) {}
  }, [pathname, sessionId, setSessionId, fetchProducts]);

  const handleIntroFinish = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('zonafit_intro_seen', 'true');
      document.documentElement.classList.add('no-intro');
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
