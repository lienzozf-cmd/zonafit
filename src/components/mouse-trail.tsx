'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  time: number;
}

const LIFESPAN = 1000; // 1 second lifetime

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run in browser with pointer support
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const now = Date.now();
      const points = pointsRef.current;

      // Filter out expired points older than 1 second
      while (points.length > 0 && now - points[0].time > LIFESPAN) {
        points.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length > 1) {
        // Draw continuous solid glowing red line
        for (let i = 0; i < points.length - 1; i++) {
          const pt = points[i];
          const nextPt = points[i + 1];

          const age = (now - pt.time) / LIFESPAN; // 0 (new) to 1 (expired)
          const opacity = Math.max(0, 1 - age);
          const currentWidth = Math.max(1.5, 4.5 * (1 - age * 0.7));

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);

          // Solid vivid red neon laser line
          ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.95})`;
          ctx.lineWidth = currentWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#FF0000';
          ctx.shadowBlur = 8 * opacity;
          ctx.stroke();
        }
      }

      // Keep animation running as long as points exist
      if (points.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interpolate extra intermediate points if mouse moved fast for perfectly continuous smooth line
        if (dist > 10) {
          const steps = Math.min(Math.floor(dist / 6), 8);
          for (let step = 1; step < steps; step++) {
            const ratio = step / steps;
            pointsRef.current.push({
              x: lastPosRef.current.x + dx * ratio,
              y: lastPosRef.current.y + dy * ratio,
              time: now,
            });
          }
        }
      }

      pointsRef.current.push({
        x,
        y,
        time: now,
      });

      lastPosRef.current = { x, y };

      // Start animation loop if not running
      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99999]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
