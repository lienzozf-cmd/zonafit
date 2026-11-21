'use client';

import confetti from 'canvas-confetti';

let fire: ReturnType<typeof confetti.create> | undefined;

function getConfetti() {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Avoid blob workers, which the site's CSP blocks. Keep one reusable renderer.
  fire ??= confetti.create(undefined, { resize: true, useWorker: false, disableForReducedMotion: true });
  return fire;
}

export function celebrateCartAddition() {
  const launch = getConfetti();
  if (!launch) return;
  void launch({ particleCount: 90, spread: 75, startVelocity: 35, origin: { x: 0.5, y: 0.65 }, zIndex: 100000 });
}

export function celebrateCheckout(): number {
  const launch = getConfetti();
  if (!launch) return 0;
  const duration = 2000;
  const end = Date.now() + duration;
  const burst = () => {
    const particleCount = Math.max(12, 50 * ((end - Date.now()) / duration));
    const options = { particleCount, spread: 100, startVelocity: 35, ticks: 80, zIndex: 100000 };
    // Start inside the visible viewport, immediately on click.
    void launch({ ...options, angle: 60, origin: { x: 0.15, y: 0.4 } });
    void launch({ ...options, angle: 120, origin: { x: 0.85, y: 0.4 } });
  };
  burst();
  const interval = window.setInterval(() => {
    if (Date.now() >= end) window.clearInterval(interval);
    else burst();
  }, 250);
  return duration;
}
