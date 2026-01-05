'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';
import { useCartStore } from '@/stores/cart-store';
import { getFirebaseApp } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    // Initialize Firebase app
    getFirebaseApp();
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

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
