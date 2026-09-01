'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
  size: number;
}

const LIFESPAN = 1000; // 1 second in milliseconds

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
        // Draw fluid glowing trail ribbon
        for (let i = 0; i < points.length - 1; i++) {
          const pt = points[i];
          const nextPt = points[i + 1];

          const age = (now - pt.time) / LIFESPAN; // 0 (new) to 1 (expired)
          const opacity = Math.max(0, 1 - age);
          const currentSize = Math.max(1, pt.size * (1 - age * 0.7));

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);

          // Vivid red glowing neon line
          ctx.strokeStyle = `rgba(229, 0, 0, ${opacity * 0.85})`;
          ctx.lineWidth = currentSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = 'rgba(255, 0, 40, 0.9)';
          ctx.shadowBlur = 10 * opacity;
          ctx.stroke();

          // Particle sparks along the path
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(pt.x + pt.vx * age * 15, pt.y + pt.vy * age * 15, currentSize * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 60, 60, ${opacity * 0.9})`;
            ctx.shadowColor = '#FF0033';
            ctx.shadowBlur = 14 * opacity;
            ctx.fill();
          }
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

      let vx = 0;
      let vy = 0;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate velocity for drift effect
        if (dist > 0) {
          vx = (Math.random() - 0.5) * 2;
          vy = (Math.random() - 0.5) * 2;
        }

        // Interpolate extra intermediate points if mouse moved fast
        if (dist > 15) {
          const steps = Math.min(Math.floor(dist / 8), 6);
          for (let step = 1; step < steps; step++) {
            const ratio = step / steps;
            pointsRef.current.push({
              x: lastPosRef.current.x + dx * ratio,
              y: lastPosRef.current.y + dy * ratio,
              time: now,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              size: 4.5 + Math.random() * 2
            });
          }
        }
      }

      pointsRef.current.push({
        x,
        y,
        time: now,
        vx,
        vy,
        size: 5.5
      });

      lastPosRef.current = { x, y };

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
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] w-screen h-screen"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
