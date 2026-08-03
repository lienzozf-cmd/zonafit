'use client';

import { useState, useEffect } from 'react';

export default function ResetCookieButton() {
  const [currentConsent, setCurrentConsent] = useState<string | null>(null);

  useEffect(() => {
    setCurrentConsent(localStorage.getItem('cookie-consent'));
  }, []);

  const handleReset = () => {
    localStorage.removeItem('cookie-consent');
    window.dispatchEvent(new Event('cookie-consent-changed'));
    // Reload page to show banner again
    window.location.reload();
  };

  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg max-w-md my-6">
      <p className="text-sm text-zinc-400 mb-3">
        Estado de consentimiento actual:{' '}
        <span className="font-semibold text-white">
          {currentConsent === 'accepted'
            ? 'Aceptado'
            : currentConsent === 'declined'
            ? 'Rechazado'
            : 'No definido (se mostrará el aviso)'}
        </span>
      </p>
      <button
        onClick={handleReset}
        className="px-4 py-2 text-xs md:text-sm font-semibold text-white bg-[#E50000] hover:bg-[#b80000] rounded transition duration-150 shadow-[0_0_10px_rgba(229,0,0,0.2)]"
      >
        Restablecer y ver aviso de cookies
      </button>
    </div>
  );
}
