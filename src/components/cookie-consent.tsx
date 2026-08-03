'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent decision has already been made
    const stored = localStorage.getItem('cookie-consent');
    if (!stored) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Dispatch custom event to let AnalyticsTracker know
    window.dispatchEvent(new Event('cookie-consent-changed'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    window.dispatchEvent(new Event('cookie-consent-changed'));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99999] p-4 md:p-6 bg-[#0c0c0c] border-t-2 border-[#E50000] shadow-[0_-5px_25px_rgba(229,0,0,0.15)] animate-in fade-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm md:text-base text-zinc-300 text-center md:text-left">
          <p>
            Utilizamos cookies y herramientas de análisis para personalizar el contenido y medir el tráfico del sitio (como Google Ads y Microsoft Clarity). Puedes leer más en nuestras{' '}
            <Link href="/politicas-de-privacidad" className="text-[#E50000] hover:underline font-semibold">
              Políticas de Privacidad
            </Link>{' '}
            y{' '}
            <Link href="/terminos-y-condiciones" className="text-[#E50000] hover:underline font-semibold">
              Términos y Condiciones
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-xs md:text-sm font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded hover:text-white hover:bg-zinc-800 transition duration-150"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-[#E50000] hover:bg-[#b80000] rounded transition duration-150 shadow-[0_0_10px_rgba(229,0,0,0.3)]"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
