'use client';

import { useState, useEffect } from 'react';
import IntroAnimation from './intro-animation';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [introFinished, setIntroFinished] = useState(true); // Default to true on server
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (sessionStorage.getItem('introShown')) {
      setIntroFinished(true);
    } else {
      setIntroFinished(false);
    }
  }, []);

  const handleIntroFinish = () => {
    setIntroFinished(true);
    sessionStorage.setItem('introShown', 'true');
  };

  if (!isClient) {
    // Render nothing on the server to avoid hydration mismatch
    return null;
  }

  if (!introFinished) {
    return <IntroAnimation onIntroFinish={handleIntroFinish} />;
  }

  return <>{children}</>;
}
