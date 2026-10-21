'use client';

import React from 'react';

/**
 * Halloween LED Neon Outline Background
 * Elementos de contorno LED estilo neón en colores vibrantes:
 * - Naranja Neón (#ff7a00 / #f97316)
 * - Verde Tóxico (#22c55e / #10b981)
 * - Morado Eléctrico (#c084fc / #a855f7)
 * 
 * Capa z-0: por encima del fondo base negro y por detrás de todos los productos y banners (z-10).
 * Excluye el footer que tiene z-30 y fondo sólido opaco.
 */
export default function HalloweenLedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* =========================================================================
          1. ESQUINA SUPERIOR IZQUIERDA: Telaraña Neón Morada Brillante
          ========================================================================= */}
      <div
        className="absolute -top-4 -left-4 w-56 h-56 sm:w-80 sm:h-80 opacity-85 sm:opacity-90 animate-pulse"
        style={{ animationDuration: '4.5s' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#c084fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_20px_#9333ea]"
        >
          {/* Radios estructurales */}
          <line x1="0" y1="0" x2="100" y2="100" strokeWidth="2.8" />
          <line x1="0" y1="0" x2="100" y2="35" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="100" y2="70" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="35" y2="100" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="70" y2="100" strokeWidth="2.5" />
          {/* Anillos concéntricos festoneados */}
          <path d="M 0 25 Q 16 22 25 0" strokeWidth="2.2" />
          <path d="M 0 50 Q 34 45 50 0" strokeWidth="2.2" />
          <path d="M 0 75 Q 52 68 75 0" strokeWidth="2.4" />
          <path d="M 0 100 Q 70 90 100 0" strokeWidth="2.6" />
          {/* Araña neón colgando del hilo */}
          <line x1="48" y1="42" x2="48" y2="68" stroke="#e9d5ff" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="48" cy="71" r="3.5" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />
          <path d="M 45 70 Q 40 66 38 71 M 45 72 Q 39 72 38 76 M 51 70 Q 56 66 58 71 M 51 72 Q 57 72 58 76" stroke="#c084fc" strokeWidth="1.6" />
        </svg>
      </div>

      {/* Murciélago Neón Morado Superior Izquierdo */}
      <div
        className="absolute top-28 left-4 sm:left-20 w-20 h-12 sm:w-28 sm:h-16 opacity-85 sm:opacity-90 animate-bounce"
        style={{ animationDuration: '6s' }}
      >
        <svg
          viewBox="0 0 100 60"
          fill="none"
          stroke="#c084fc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_22px_#9333ea]"
        >
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* =========================================================================
          2. ESQUINA SUPERIOR DERECHA: Telaraña Neón Naranja Brillante
          ========================================================================= */}
      <div
        className="absolute -top-4 -right-4 w-56 h-56 sm:w-80 sm:h-80 opacity-85 sm:opacity-90 animate-pulse"
        style={{ animationDuration: '5s' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ff7a00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#ff7a00] drop-shadow-[0_0_20px_#ea580c]"
        >
          <line x1="100" y1="0" x2="0" y2="100" strokeWidth="2.8" />
          <line x1="100" y1="0" x2="0" y2="35" strokeWidth="2.5" />
          <line x1="100" y1="0" x2="0" y2="70" strokeWidth="2.5" />
          <line x1="100" y1="0" x2="65" y2="100" strokeWidth="2.5" />
          <line x1="100" y1="0" x2="30" y2="100" strokeWidth="2.5" />
          <path d="M 100 25 Q 84 22 75 0" strokeWidth="2.2" />
          <path d="M 100 50 Q 66 45 50 0" strokeWidth="2.2" />
          <path d="M 100 75 Q 48 68 25 0" strokeWidth="2.4" />
          <path d="M 100 100 Q 30 90 0 0" strokeWidth="2.6" />
        </svg>
      </div>

      {/* Fantasma Neón Verde Tóxico Superior Derecho */}
      <div
        className="absolute top-28 right-4 sm:right-24 w-20 h-24 sm:w-28 sm:h-32 opacity-85 sm:opacity-90"
        style={{ animation: 'floatSlow 5.5s ease-in-out infinite' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#22c55e] drop-shadow-[0_0_22px_#16a34a]"
        >
          {/* Silueta ondulada de fantasma */}
          <path d="M 50 14 C 30 14, 22 28, 22 48 C 22 68, 16 78, 20 84 C 24 82, 28 76, 34 80 C 40 84, 44 80, 50 84 C 56 80, 60 84, 66 80 C 72 76, 76 82, 80 84 C 84 78, 78 68, 78 48 C 78 28, 70 14, 50 14 Z" />
          {/* Brazos espectrales */}
          <path d="M 22 50 Q 12 55 16 64 Q 20 62 23 56" />
          <path d="M 78 50 Q 88 55 84 64 Q 80 62 77 56" />
          {/* Ojos y boca huecos neón */}
          <ellipse cx="39" cy="38" rx="4" ry="7" fill="#22c55e" fillOpacity="0.3" strokeWidth="2" />
          <ellipse cx="61" cy="38" rx="4" ry="7" fill="#22c55e" fillOpacity="0.3" strokeWidth="2" />
          <ellipse cx="50" cy="54" rx="5" ry="8" fill="#22c55e" fillOpacity="0.3" strokeWidth="2" />
        </svg>
      </div>

      {/* =========================================================================
          3. LATERALES MEDIOS (A los lados de banners, marcas y productos)
          ========================================================================= */}

      {/* Gran Calabaza Neón Naranja (Lateral Izquierdo) */}
      <div
        className="absolute top-[36%] left-2 sm:left-10 w-24 h-24 sm:w-36 sm:h-36 opacity-85 sm:opacity-90"
        style={{ animation: 'floatSlow 6.5s ease-in-out infinite reverse' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ff7a00"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_10px_#ff7a00] drop-shadow-[0_0_24px_#ea580c]"
        >
          {/* Tallo verde brillante */}
          <path d="M 50 18 Q 53 8 60 6 Q 56 12 52 18" stroke="#22c55e" strokeWidth="3" />
          {/* Silueta exterior calabaza */}
          <path d="M 50 18 C 34 18, 18 28, 18 50 C 18 72, 34 82, 50 82 C 66 82, 82 72, 82 50 C 82 28, 66 18, 50 18 Z" />
          {/* Costillas de calabaza */}
          <path d="M 50 18 C 38 20, 28 32, 28 50 C 28 68, 38 80, 50 82" strokeWidth="2" />
          <path d="M 50 18 C 62 20, 72 32, 72 50 C 72 68, 62 80, 50 82" strokeWidth="2" />
          {/* Ojos triangulares */}
          <polygon points="34,44 44,44 39,34" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          <polygon points="56,44 66,44 61,34" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          {/* Nariz */}
          <polygon points="50,48 46,54 54,54" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          {/* Sonrisa dentada de Halloween */}
          <path d="M 28 62 L 35 68 L 41 63 L 50 69 L 59 63 L 65 68 L 72 62 Q 50 78 28 62 Z" fill="#ff7a00" fillOpacity="0.3" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Calavera Neón Verde Tóxico (Lateral Derecho) */}
      <div
        className="absolute top-[38%] right-2 sm:right-10 w-22 h-26 sm:w-32 sm:h-36 opacity-85 sm:opacity-90"
        style={{ animation: 'floatSlow 7s ease-in-out infinite' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_10px_#10b981] drop-shadow-[0_0_24px_#059669]"
        >
          {/* Contorno cráneo */}
          <path d="M 26 44 C 26 24, 38 14, 50 14 C 62 14, 74 24, 74 44 C 74 56, 68 62, 64 66 L 64 78 L 36 78 L 36 66 C 32 62, 26 56, 26 44 Z" />
          {/* Dientes */}
          <line x1="43" y1="70" x2="43" y2="78" strokeWidth="2.5" />
          <line x1="50" y1="70" x2="50" y2="78" strokeWidth="2.5" />
          <line x1="57" y1="70" x2="57" y2="78" strokeWidth="2.5" />
          {/* Cuencas de ojos brillantes */}
          <ellipse cx="39" cy="44" rx="7" ry="9" fill="#10b981" fillOpacity="0.35" strokeWidth="2" />
          <ellipse cx="61" cy="44" rx="7" ry="9" fill="#10b981" fillOpacity="0.35" strokeWidth="2" />
          {/* Nariz */}
          <path d="M 50 56 L 46 62 L 54 62 Z" fill="#10b981" fillOpacity="0.4" strokeWidth="2" />
        </svg>
      </div>

      {/* Murciélago Neón Naranja (Lateral Centro-Derecho) */}
      <div
        className="absolute top-[52%] right-8 sm:right-28 w-18 h-12 sm:w-26 sm:h-16 opacity-80 sm:opacity-90 animate-bounce"
        style={{ animationDuration: '8s' }}
      >
        <svg
          viewBox="0 0 100 60"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#f97316] drop-shadow-[0_0_20px_#ea580c]"
        >
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* =========================================================================
          4. ZONA INFERIOR (Arriba del footer)
          ========================================================================= */}

      {/* Fantasma Neón Morado Eléctrico (Lateral Izquierdo Inferior) */}
      <div
        className="absolute top-[68%] left-3 sm:left-14 w-22 h-26 sm:w-32 sm:h-36 opacity-85 sm:opacity-90"
        style={{ animation: 'floatSlow 6.8s ease-in-out infinite' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#c084fc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_10px_#a855f7] drop-shadow-[0_0_24px_#9333ea]"
        >
          <path d="M 50 14 C 30 14, 22 28, 22 48 C 22 68, 16 78, 20 84 C 24 82, 28 76, 34 80 C 40 84, 44 80, 50 84 C 56 80, 60 84, 66 80 C 72 76, 76 82, 80 84 C 84 78, 78 68, 78 48 C 78 28, 70 14, 50 14 Z" />
          <path d="M 22 50 Q 12 55 16 64 Q 20 62 23 56" />
          <path d="M 78 50 Q 88 55 84 64 Q 80 62 77 56" />
          <ellipse cx="39" cy="38" rx="4" ry="7" fill="#c084fc" fillOpacity="0.35" strokeWidth="2" />
          <ellipse cx="61" cy="38" rx="4" ry="7" fill="#c084fc" fillOpacity="0.35" strokeWidth="2" />
          <ellipse cx="50" cy="54" rx="5" ry="8" fill="#c084fc" fillOpacity="0.35" strokeWidth="2" />
        </svg>
      </div>

      {/* Calabaza Neón Naranja (Lateral Derecho Inferior) */}
      <div
        className="absolute top-[70%] right-3 sm:right-16 w-24 h-24 sm:w-34 sm:h-34 opacity-85 sm:opacity-90"
        style={{ animation: 'floatSlow 6.2s ease-in-out infinite reverse' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#ff7a00"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_10px_#ff7a00] drop-shadow-[0_0_24px_#ea580c]"
        >
          <path d="M 50 18 Q 53 8 60 6 Q 56 12 52 18" stroke="#10b981" strokeWidth="3" />
          <path d="M 50 18 C 34 18, 18 28, 18 50 C 18 72, 34 82, 50 82 C 66 82, 82 72, 82 50 C 82 28, 66 18, 50 18 Z" />
          <path d="M 50 18 C 38 20, 28 32, 28 50 C 28 68, 38 80, 50 82" strokeWidth="2" />
          <path d="M 50 18 C 62 20, 72 32, 72 50 C 72 68, 62 80, 50 82" strokeWidth="2" />
          <polygon points="34,44 44,44 39,34" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          <polygon points="56,44 66,44 61,34" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          <polygon points="50,48 46,54 54,54" fill="#ff7a00" fillOpacity="0.35" strokeWidth="2" />
          <path d="M 28 62 L 35 68 L 41 63 L 50 69 L 59 63 L 65 68 L 72 62 Q 50 78 28 62 Z" fill="#ff7a00" fillOpacity="0.3" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Telaraña Neón Verde Tóxico (Inferior Izquierda) */}
      <div
        className="absolute top-[82%] -left-6 w-48 h-48 sm:w-72 sm:h-72 opacity-80 sm:opacity-85 animate-pulse"
        style={{ animationDuration: '6s' }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#22c55e] drop-shadow-[0_0_20px_#16a34a]"
        >
          <line x1="0" y1="100" x2="100" y2="0" strokeWidth="2.8" />
          <line x1="0" y1="100" x2="100" y2="65" strokeWidth="2.4" />
          <line x1="0" y1="100" x2="100" y2="30" strokeWidth="2.4" />
          <line x1="0" y1="100" x2="35" y2="0" strokeWidth="2.4" />
          <line x1="0" y1="100" x2="70" y2="0" strokeWidth="2.4" />
          <path d="M 0 75 Q 16 78 25 100" strokeWidth="2.2" />
          <path d="M 0 50 Q 34 55 50 100" strokeWidth="2.2" />
          <path d="M 0 25 Q 52 32 75 100" strokeWidth="2.4" />
          <path d="M 0 0 Q 70 10 100 100" strokeWidth="2.6" />
        </svg>
      </div>

      {/* Murciélago Neón Morado (Inferior Centro) */}
      <div
        className="absolute top-[84%] left-[42%] w-18 h-10 sm:w-26 sm:h-16 opacity-80 sm:opacity-90 animate-bounce"
        style={{ animationDuration: '7.5s' }}
      >
        <svg
          viewBox="0 0 100 60"
          fill="none"
          stroke="#c084fc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full filter drop-shadow-[0_0_8px_#a855f7] drop-shadow-[0_0_20px_#9333ea]"
        >
          <path d="M 46 26 L 48 18 L 50 21 L 52 18 L 54 26" />
          <path d="M 54 26 Q 66 12 88 8 Q 84 22 96 30 Q 78 34 70 48 Q 62 36 55 36 L 50 42 L 45 36 Q 38 36 30 48 Q 22 34 4 30 Q 16 22 12 8 Q 34 12 46 26 Z" />
        </svg>
      </div>

      {/* Keyframes de animación suave para levitación de neón */}
      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
