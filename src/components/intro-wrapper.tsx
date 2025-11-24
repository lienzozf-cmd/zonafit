
'use client';

// import { useState, useEffect } from 'react';
// import IntroAnimation from './intro-animation';

export default function IntroWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [introFinished, setIntroFinished] = useState(true);
  // const [isClient, setIsClient] = useState(false);
  //
  // useEffect(() => {
  //   setIsClient(true);
  //   try {
  //     if (sessionStorage.getItem('introShown')) {
  //       setIntroFinished(true);
  //     } else {
  //       setIntroFinished(false);
  //     }
  //   } catch (error) {
  //     setIntroFinished(true);
  //   }
  // }, []);
  //
  // const handleIntroFinish = () => {
  //   setIntroFinished(true);
  //   try {
  //     sessionStorage.setItem('introShown', 'true');
  //   } catch (error) {
  //     // Handle potential errors with sessionStorage
  //   }
  // };
  //
  // if (!isClient) {
  //   return null;
  // }
  //
  // if (!introFinished) {
  //   return <IntroAnimation onIntroFinish={handleIntroFinish} />;
  // }

  return <>{children}</>;
}
