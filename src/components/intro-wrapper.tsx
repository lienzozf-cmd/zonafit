'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';
import { useCartStore } from '@/stores/cart-store';
import { getFirebaseApp } from '@/lib/firebase';
import { usePathname } from 'next/navigation';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { setSessionId, sessionId, fetchProducts } = useCartStore((state) => ({
    setSessionId: state.setSessionId,
    sessionId: state.sessionId,
    fetchProducts: state.fetchProducts,
  }));
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 11));
    }
    // Initialize Firebase app
    getFirebaseApp();
    // Fetch products from the API
    fetchProducts();

    try {
      if (sessionStorage.getItem('introShown')) {
        setIntroFinished(true);
      } else {
        setIntroFinished(false);
      }
    } catch (error) {
      // If sessionStorage is disabled, default to not showing the intro.
      setIntroFinished(true);
    }
  }, [sessionId, setSessionId, fetchProducts]);

  const handleIntroFinish = () => {
    setIntroFinished(true);
    try {
      sessionStorage.setItem('introShown', 'true');
    } catch (error) {
      // Handle potential errors with sessionStorage
    }
  };

  if (!isClient) {
    return null;
  }

  if (!introFinished) {
    return <IntroAnimation onIntroFinish={handleIntroFinish} />;
  }

  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  );
}
