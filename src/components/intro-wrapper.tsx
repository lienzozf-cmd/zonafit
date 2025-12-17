'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';
import { useCartStore } from '@/stores/cart-store';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const fetchProducts = useCartStore((state) => state.fetchProducts);

  useEffect(() => {
    setIsClient(true);
    // Fetch latest products on every initial load while intro is handled.
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
  }, [fetchProducts]);

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

  return <>{children}</>;
}
