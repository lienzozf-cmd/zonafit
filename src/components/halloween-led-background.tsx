'use client';

import React from 'react';

/**
 * Halloween LED Neon Outline Background
 * Elementos de contorno LED estilo neón en naranja, verde tóxico y morado eléctrico.
 * Ubicados detrás de los banners, productos y categorías en todas las páginas,
 * excluyendo el footer.
 */
export default function HalloweenLedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* =========================================================================
          ESQUINA SUPERIOR IZQUIERDA (Detrás del encabezado/banner)
          ========================================================================= */}
      
      {/* Telaraña Neón Morada Superior Izquierda */}
      <div className="absolute -top-6 -left-6 w-48 h-48 sm:w-72 sm:h-72 opacity-40 sm:opacity-50 animate-pulse" style={{ animationDuration: '6s' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_18px_rgba(168,85,247,0.6)]">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="0" y1="0" x2="100" y2="35" />
          <line x1="0" y1="0" x2="100" y2="70" />
          <line x1="0" y1="0" x2="35" y2="100" />
          <line x1="0" y1="0" x2="70" y2="100" />
          {/* Anillos curvos concéntricos */}
          <path d="M 0 25 Q 15 22 25 0" />
          <path d="M 0 50 Q 32 45 50 0" />
          <path d="M 0 75 Q 50 68 75 0" />
          <path d="M 0 100 Q 68 90 100 0" />
          {/* Pequeña araña neón colgando */}
          <line x1="45" y1="38" x2="45" y2="60" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="45" cy="62" r="3" fill="#a855f7" />
          <path d="M 42 61 Q 38 58 37 62 M 42 63 Q 37 63 36 66 M 48 61 Q 52 58 53 62 M 48 63 Q 53 63 54 66" stroke="#c084fc" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Murciélago Neón Morado Flotante Superior Izquierdo */}
      <div className="absolute top-24 left-10 sm:left-24 w-16 h-10 sm:w-24 sm:h-14 opacity-35 sm:opacity-45 animate-bounce" style={{ animationDuration: '7s' }}>
        <svg viewBox="0 0 100 60" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]">
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* =========================================================================
          ESQUINA SUPERIOR DERECHA (Detrás del lateral del banner)
          ========================================================================= */}
      
      {/* Telaraña Neón Naranja Superior Derecha */}
      <div className="absolute -top-6 -right-6 w-48 h-48 sm:w-72 sm:h-72 opacity-40 sm:opacity-50 animate-pulse" style={{ animationDuration: '5.5s' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#f97316] drop-shadow-[0_0_18px_rgba(249,115,22,0.6)]">
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="100" y1="0" x2="0" y2="35" />
          <line x1="100" y1="0" x2="0" y2="70" />
          <line x1="100" y1="0" x2="65" y2="100" />
          <line x1="100" y1="0" x2="30" y2="100" />
          <path d="M 100 25 Q 85 22 75 0" />
          <path d="M 100 50 Q 68 45 50 0" />
          <path d="M 100 75 Q 50 68 25 0" />
          <path d="M 100 100 Q 32 90 0 0" />
        </svg>
      </div>

      {/* Fantasma Neón Verde Tóxico Superior Derecho */}
      <div className="absolute top-28 right-6 sm:right-20 w-16 h-20 sm:w-24 sm:h-28 opacity-35 sm:opacity-45" style={{ animation: 'floatSlow 6s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#22c55e] drop-shadow-[0_0_18px_rgba(34,197,94,0.7)]">
          {/* Silueta contorno de fantasma */}
          <path d="M 50 14 C 30 14, 22 28, 22 48 C 22 68, 16 78, 20 84 C 24 82, 28 76, 34 80 C 40 84, 44 80, 50 84 C 56 80, 60 84, 66 80 C 72 76, 76 82, 80 84 C 84 78, 78 68, 78 48 C 78 28, 70 14, 50 14 Z" />
          {/* Brazos ondulados */}
          <path d="M 22 50 Q 12 55 16 64 Q 20 62 23 56" />
          <path d="M 78 50 Q 88 55 84 64 Q 80 62 77 56" />
          {/* Ojos y boca huecos estilo neón */}
          <ellipse cx="39" cy="38" rx="3.5" ry="6" fill="#22c55e" fillOpacity="0.2" />
          <ellipse cx="61" cy="38" rx="3.5" ry="6" fill="#22c55e" fillOpacity="0.2" />
          <ellipse cx="50" cy="54" rx="4.5" ry="7" fill="#22c55e" fillOpacity="0.2" />
        </svg>
      </div>

      {/* =========================================================================
          ZONA CENTRAL / LATERALES (Detrás de filas de productos y categorías)
          ========================================================================= */}

      {/* Calabaza Neón Naranja (Lateral Izquierdo) */}
      <div className="absolute top-[38%] -left-4 sm:left-4 w-20 h-20 sm:w-28 sm:h-28 opacity-35 sm:opacity-45" style={{ animation: 'floatSlow 7s ease-in-out infinite reverse' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#f97316] drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]">
          {/* Tallo verde */}
          <path d="M 50 18 Q 53 8 60 6 Q 56 12 52 18" stroke="#22c55e" strokeWidth="2.5" />
          {/* Contorno exterior calabaza */}
          <path d="M 50 18 C 34 18, 18 28, 18 50 C 18 72, 34 82, 50 82 C 66 82, 82 72, 82 50 C 82 28, 66 18, 50 18 Z" />
          {/* Costillas internas */}
          <path d="M 50 18 C 38 20, 28 32, 28 50 C 28 68, 38 80, 50 82" />
          <path d="M 50 18 C 62 20, 72 32, 72 50 C 72 68, 62 80, 50 82" />
          {/* Ojos triangulares */}
          <polygon points="34,44 44,44 39,34" fill="#f97316" fillOpacity="0.25" />
          <polygon points="56,44 66,44 61,34" fill="#f97316" fillOpacity="0.25" />
          {/* Nariz */}
          <polygon points="50,48 46,54 54,54" fill="#f97316" fillOpacity="0.25" />
          {/* Sonrisa siniestra dentada */}
          <path d="M 28 62 L 35 68 L 41 63 L 50 69 L 59 63 L 65 68 L 72 62 Q 50 78 28 62 Z" fill="#f97316" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Calavera Neón Verde Tóxico (Lateral Derecho) */}
      <div className="absolute top-[42%] -right-3 sm:right-6 w-18 h-20 sm:w-26 sm:h-28 opacity-30 sm:opacity-45" style={{ animation: 'floatSlow 8s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#10b981] drop-shadow-[0_0_18px_rgba(16,185,129,0.7)]">
          {/* Cráneo */}
          <path d="M 26 44 C 26 24, 38 14, 50 14 C 62 14, 74 24, 74 44 C 74 56, 68 62, 64 66 L 64 78 L 36 78 L 36 66 C 32 62, 26 56, 26 44 Z" />
          {/* Dientes */}
          <line x1="43" y1="70" x2="43" y2="78" />
          <line x1="50" y1="70" x2="50" y2="78" />
          <line x1="57" y1="70" x2="57" y2="78" />
          {/* Cuencas de ojos */}
          <ellipse cx="39" cy="44" rx="6.5" ry="8" fill="#10b981" fillOpacity="0.25" />
          <ellipse cx="61" cy="44" rx="6.5" ry="8" fill="#10b981" fillOpacity="0.25" />
          {/* Nariz hueca */}
          <path d="M 50 56 L 46 62 L 54 62 Z" fill="#10b981" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Murciélago Neón Naranja (Centro-Derecha detrás de productos) */}
      <div className="absolute top-[55%] right-12 sm:right-32 w-14 h-9 sm:w-20 sm:h-12 opacity-25 sm:opacity-35 animate-bounce" style={{ animationDuration: '9s' }}>
        <svg viewBox="0 0 100 60" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#f97316]">
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* Fantasma Neón Morado Flotante (Lateral Izquierdo Inferior) */}
      <div className="absolute top-[68%] left-4 sm:left-14 w-18 h-22 sm:w-24 sm:h-30 opacity-35 sm:opacity-45" style={{ animation: 'floatSlow 7.5s ease-in-out infinite' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_18px_rgba(168,85,247,0.7)]">
          <path d="M 50 14 C 30 14, 22 28, 22 48 C 22 68, 16 78, 20 84 C 24 82, 28 76, 34 80 C 40 84, 44 80, 50 84 C 56 80, 60 84, 66 80 C 72 76, 76 82, 80 84 C 84 78, 78 68, 78 48 C 78 28, 70 14, 50 14 Z" />
          <path d="M 22 50 Q 12 55 16 64 Q 20 62 23 56" />
          <path d="M 78 50 Q 88 55 84 64 Q 80 62 77 56" />
          <ellipse cx="39" cy="38" rx="3.5" ry="6" fill="#a855f7" fillOpacity="0.25" />
          <ellipse cx="61" cy="38" rx="3.5" ry="6" fill="#a855f7" fillOpacity="0.25" />
          <ellipse cx="50" cy="54" rx="4.5" ry="7" fill="#a855f7" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Calabaza Neón Naranja (Lateral Derecho Inferior) */}
      <div className="absolute top-[75%] right-4 sm:right-16 w-20 h-20 sm:w-28 sm:h-28 opacity-35 sm:opacity-45" style={{ animation: 'floatSlow 6.5s ease-in-out infinite reverse' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#f97316] drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]">
          <path d="M 50 18 Q 53 8 60 6 Q 56 12 52 18" stroke="#10b981" strokeWidth="2.5" />
          <path d="M 50 18 C 34 18, 18 28, 18 50 C 18 72, 34 82, 50 82 C 66 82, 82 72, 82 50 C 82 28, 66 18, 50 18 Z" />
          <path d="M 50 18 C 38 20, 28 32, 28 50 C 28 68, 38 80, 50 82" />
          <path d="M 50 18 C 62 20, 72 32, 72 50 C 72 68, 62 80, 50 82" />
          <polygon points="34,44 44,44 39,34" fill="#f97316" fillOpacity="0.25" />
          <polygon points="56,44 66,44 61,34" fill="#f97316" fillOpacity="0.25" />
          <polygon points="50,48 46,54 54,54" fill="#f97316" fillOpacity="0.25" />
          <path d="M 28 62 L 35 68 L 41 63 L 50 69 L 59 63 L 65 68 L 72 62 Q 50 78 28 62 Z" fill="#f97316" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Telaraña Neón Verde Tóxico (Inferior Izquierda) */}
      <div className="absolute top-[85%] -left-8 w-44 h-44 sm:w-64 sm:h-64 opacity-30 sm:opacity-40 animate-pulse" style={{ animationDuration: '6.5s' }}>
        <svg viewBox="0 0 100 100" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#22c55e]">
          <line x1="0" y1="100" x2="100" y2="0" />
          <line x1="0" y1="100" x2="100" y2="65" />
          <line x1="0" y1="100" x2="100" y2="30" />
          <line x1="0" y1="100" x2="35" y2="0" />
          <line x1="0" y1="100" x2="70" y2="0" />
          <path d="M 0 75 Q 15 78 25 100" />
          <path d="M 0 50 Q 32 55 50 100" />
          <path d="M 0 25 Q 50 32 75 100" />
          <path d="M 0 0 Q 68 10 100 100" />
        </svg>
      </div>

      {/* Murciélago Neón Morado (Inferior Centro) */}
      <div className="absolute top-[88%] left-[45%] w-14 h-8 sm:w-20 sm:h-12 opacity-25 sm:opacity-35 animate-bounce" style={{ animationDuration: '8s' }}>
        <svg viewBox="0 0 100 60" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7]">
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* CSS Keyframes para animaciones de flotación suave */}
      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
