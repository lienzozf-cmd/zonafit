
'use client';

import confetti from 'canvas-confetti';

// INSTRUCCIONES PARA USAR ESTE CÓDIGO EN OTRO PROYECTO:
//
// 1. INSTALA LAS DEPENDENCIAS:
//    Abre tu terminal y ejecuta los siguientes comandos en la carpeta de tu nuevo proyecto:
//
//    npm install canvas-confetti
//    npm install -D @types/canvas-confetti
//
// 2. COPIA Y PEGA ESTE COMPONENTE:
//    Copia el código de este componente 'ConfettiExample' y pégalo en un nuevo archivo
//    en tu proyecto, por ejemplo, `confetti-button.tsx`.
//
// 3. ¡ÚSALO!
//    Importa y utiliza el componente `ConfettiButton` donde quieras que aparezca
//    el botón que dispara la animación.

/**
 * Dispara una animación de confeti.
 * Puedes personalizar las opciones para cambiar el efecto.
 * Visita https://www.kirilv.com/canvas-confetti/ para ver más ejemplos.
 */
const fireConfetti = () => {
  // Lanza el confeti
  confetti({
    particleCount: 100, // Número de partículas de confeti
    spread: 70,         // Qué tan disperso sale el confeti
    origin: { y: 0.6 }, // Dónde empieza la animación en la pantalla (0.6 es un poco por encima del centro)
  });
};


/**
 * Un componente de botón simple que dispara la animación de confeti al hacer clic.
 */
export function ConfettiButton() {
  const handleClick = () => {
    // Aquí es donde se llama a la función para lanzar el confeti.
    // Puedes llamar a `fireConfetti()` desde cualquier manejador de eventos (onClick, onSubmit, etc.)
    fireConfetti();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#E50000',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      ¡Lanzar Confeti!
    </button>
  );
}

// Ejemplo de cómo usar el componente en una página:
//
// import { ConfettiButton } from './confetti-button';
//
// export default function MyPage() {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <ConfettiButton />
//     </div>
//   );
// }
