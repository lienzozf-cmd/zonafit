'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Flame, ArrowRight } from 'lucide-react';

interface DemonSlayerBannerProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export default function DemonSlayerBanner({ onOpenChange }: DemonSlayerBannerProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpening) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 16,
      y: (x / rect.width) * 16
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    onOpenChange?.(true);

    // Reproducir efecto y redirigir al apartado único de Demon Slayer
    setTimeout(() => {
      router.push('/coleccion/demon-slayer');
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[16/9] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#040806] via-[#0b1410] to-[#040806] select-none cursor-pointer"
      style={{
        minHeight: '400px'
      }}
    >
      {/* Background Japanese Ichimatsu (Checkered) Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #0f2e1f 25%, transparent 25%),
            linear-gradient(-45deg, #0f2e1f 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #0f2e1f 75%),
            linear-gradient(-45deg, transparent 75%, #0f2e1f 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      {/* Fiery Crimson & Emerald Neon Radial Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      {/* Hero Banner Content */}
      <div className="relative z-10 w-full h-full flex flex-row items-center justify-between px-3 xs:px-6 sm:px-10 md:px-16 py-3 sm:py-6">
        
        {/* Left Column: Demon Slayer Typography, Brands & Story */}
        <div className="w-[52%] sm:w-1/2 flex flex-col justify-center items-start text-left z-20">
          
          {/* Top Japanese Kanji / Anime Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.35)] backdrop-blur-md mb-2 sm:mb-4">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400">
              鬼滅の刃 · COLECCIÓN ANIME OFICIAL
            </span>
          </div>

          {/* Main Title: DEMON SLAYER */}
          <h1 
            className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-none"
            style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif' }}
          >
            DEMON SLAYER
          </h1>

          {/* Sub-Brand Collaboration Row: DARC SPORT × YOUNGLA */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs xs:text-sm sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-zinc-100 my-1 sm:my-2">
            <span className="text-emerald-400 font-serif tracking-widest">DARC SPORT</span>
            <span className="text-red-500 font-bold lowercase text-xs sm:text-lg">×</span>
            <span className="text-zinc-200 tracking-wider">YOUNGLA</span>
          </div>

          {/* Description Text */}
          <p className="text-[9px] xs:text-[10px] sm:text-sm md:text-base text-zinc-300 font-medium tracking-normal sm:tracking-wide max-w-lg mt-0.5 sm:mt-1 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
            RESPIRA. ENTRENA. TRASCIENDE. DESCUBRE EL APARTADO EXCLUSIVO DE KIMETSU NO YAIBA: TANJIRO, NEZUKO, INOSUKE, ZENITSU, UZUI Y RENGOKU.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-6">
            <Link
              href="/coleccion/demon-slayer"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 via-red-600 to-emerald-600 hover:from-emerald-500 hover:to-red-500 text-white font-black text-[10px] xs:text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
              <span>EXPLORAR COLECCIÓN</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[9px] sm:text-[10px] font-mono">8 PIEZAS</span>
            </Link>

            <Link
              href="/coleccion/demon-slayer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-bold uppercase tracking-wider transition-colors"
            >
              <span>Ver apartado único</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Perspective Demon Slayer Emblem (Replaces the box) */}
        <div className="w-[48%] sm:w-1/2 flex items-center justify-center relative pr-1">
          
          {/* Glowing Neon Japanese Backing Frames (Emerald & Fiery Red) */}
          <div className="absolute w-[130px] h-[130px] xs:w-[160px] xs:h-[160px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] rounded-2xl md:rounded-3xl border border-emerald-500/60 sm:border-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] rotate-[-6deg] pointer-events-none opacity-70" />
          <div className="absolute w-[130px] h-[130px] xs:w-[160px] xs:h-[160px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] rounded-2xl md:rounded-3xl border border-red-500/60 sm:border-2 shadow-[0_0_25px_rgba(239,68,68,0.4)] rotate-[6deg] pointer-events-none opacity-60" />

          {/* Interactive 3D Emblem Container */}
          <div
            onClick={handleOpen}
            style={{ perspective: '1400px' }}
            className="relative cursor-pointer group py-2"
          >
            {!isOpening ? (
              /* Idle & Hover State: Authentic 3D Rendered Emblem with Interactive Tilt */
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  y: [0, -6, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                  scale: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                  rotateX: { type: 'spring', damping: 20, stiffness: 200 },
                  rotateY: { type: 'spring', damping: 20, stiffness: 200 }
                }}
                className="relative w-[150px] h-[100px] xs:w-[180px] xs:h-[120px] sm:w-[300px] sm:h-[190px] md:w-[420px] md:h-[250px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_30px_rgba(16,185,129,0.45)] group-hover:drop-shadow-[0_0_60px_rgba(239,68,68,0.8)] transition-all duration-300 flex items-center justify-center p-2"
              >
                {/* Subtle Inner Glow Backplate */}
                <div className="absolute inset-0 bg-radial from-emerald-950/40 via-black/80 to-transparent rounded-3xl border border-white/10 group-hover:border-emerald-500/50 transition-colors" />

                {/* Demon Slayer Logo from folder */}
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/images/demon slayer/logodemonslayer.webp"
                    alt="Logo Demon Slayer Kimetsu no Yaiba"
                    fill
                    priority
                    className="object-contain p-2"
                  />
                </div>

                {/* Subtle Interactive Sheen Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
              </motion.div>
            ) : (
              /* Katana Slash Transition Animation */
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-[150px] h-[100px] xs:w-[180px] xs:h-[120px] sm:w-[300px] sm:h-[190px] md:w-[420px] md:h-[250px] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a2318] via-black to-[#280a0d] rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.9)] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.7)_0%,transparent_75%)] animate-pulse" />
                  <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-spin" />
                  <span className="text-white font-black text-xs md:text-sm tracking-[0.2em] uppercase">
                    ENTRANDO A LA COLECCIÓN...
                  </span>

                  {/* Katana Slash Beam Line */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '150%', opacity: [0, 1, 0] }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute h-[4px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[-35deg] shadow-[0_0_25px_#fff]"
                  />
                </div>
              </motion.div>
            )}

            {/* Floating "Toca para abrir" label */}
            <div className="mt-1 sm:mt-3 flex justify-center">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-[8px] xs:text-[9px] sm:text-[11px] md:text-xs font-black tracking-wider sm:tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400 animate-spin" />
                <span>TOCA PARA ENTRAR A LA COLECCIÓN</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
