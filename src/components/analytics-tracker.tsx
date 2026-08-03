'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function AnalyticsTracker() {
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

  // Only load tracking scripts if consent is explicitly accepted
  if (consent !== 'accepted') {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-17970036779"
        strategy="afterInteractive"
      />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17970036779');
        `}
      </Script>
      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xetkm5f0zh");
        `}
      </Script>
    </>
  );
}
