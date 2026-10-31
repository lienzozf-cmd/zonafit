'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export const FB_PIXEL_ID = '1270354408481385';

export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check initial cookie consent value
    const stored = localStorage.getItem('cookie-consent');
    setConsent(stored);
    
    // Listen for custom event to update when consent is accepted/rejected
    const handleConsentChange = () => {
      setConsent(localStorage.getItem('cookie-consent'));
    };
    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    // Track PageView on route changes only if consented
    if (consent === 'accepted' && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname, consent]);

  // Only load Meta Pixel if consent is explicitly accepted
  if (consent !== 'accepted') {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
