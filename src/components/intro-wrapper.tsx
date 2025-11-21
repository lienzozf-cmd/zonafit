'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (sessionStorage.getItem('introShown')) {
      setIntroFinished(true);
    }
  }, []);

  const handleIntroFinish = () => {
    setIntroFinished(true);
    sessionStorage.setItem('introShown', 'true');
  };

  if (!isClient) {
    return null;
  }

  if (!introFinished) {
    return <IntroAnimation onIntroFinish={handleIntroFinish} />;
  }

  return <>{children}</>;
}
