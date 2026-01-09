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
  const { setSessionId, sessionId } = useCartStore((state) => ({
    setSessionId: state.setSessionId,
    sessionId: state.sessionId,
  }));
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(2, 11));
    }
    // Initialize Firebase app
    getFirebaseApp();
    // Products are now loaded statically, no need to fetch.

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
  }, [sessionId, setSessionId]);

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
