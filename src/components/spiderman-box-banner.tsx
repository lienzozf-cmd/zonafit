'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Volume2, VolumeX, ShoppingBag, Check, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

interface SpidermanTee {
  id: string;
  productId: number;
  name: string;
  brand: string;
  price: string;
  priceNum: number;
  image: string;
  image2: string;
  availability: string;
  stock: number;
  option: string;
}

const SPIDERMAN_TEES: SpidermanTee[] = [
  {
    id: 'spiderman-beast',
    productId: 9001,
    name: 'SPIDERMAN BEAST',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    image: '/assets/images/marcas/civil regime/spidermanbeast.webp',
    image2: '/assets/images/marcas/civil regime/spidermanbeast2.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    option: 'M'
  },
  {
    id: 'spider-punk',
    productId: 9002,
    name: 'SPIDER PUNK',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    image: '/assets/images/marcas/civil regime/spidermanpunk2.webp',
    image2: '/assets/images/marcas/civil regime/spidermanpunk.webp',
    availability: 'AGOTADO',
    stock: 0,
    option: 'M'
  },
  {
    id: 'miles-morales',
    productId: 9003,
    name: 'MILES MORALES',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    image: '/assets/images/marcas/civil regime/spidermanmiles.webp',
    image2: '/assets/images/marcas/civil regime/spidermanmiles2.webp',
    availability: 'AGOTADO',
    stock: 0,
    option: 'M'
  },
  {
    id: 'spiderman-peter-parker',
    productId: 9004,
    name: 'SPIDERMAN PETER PARKER',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    image: '/assets/images/marcas/civil regime/spidermanrayas2.webp',
    image2: '/assets/images/marcas/civil regime/spidermanrayas.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    option: 'M'
  }
];

interface SpidermanBoxBannerProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export default function SpidermanBoxBanner({ onOpenChange }: SpidermanBoxBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showWebEffect, setShowWebEffect] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [enlargedTee, setEnlargedTee] = useState<{ tee: SpidermanTee; isBack: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  // Initialize and handle Post Malone Sunflower Audio
  useEffect(() => {
    const audioUrl = '/' + encodeURIComponent('Post Malone, Swae Lee - Sunflower (Spider-Man Into the Spider-Verse).mp3');
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Web-Shooter Authentic "THWIP!" Sound Effect via Web Audio API
  const playWebShooterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // 1. Dual-phase high velocity gas release (noise bandpass sweep)
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(5.5, now);
      bandpass.frequency.setValueAtTime(3600, now);
      bandpass.frequency.exponentialRampToValueAtTime(750, now + 0.18);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // 2. High-tension string release "THWIP"
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
      oscGain.gain.setValueAtTime(0.45, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // 3. Mechanical wrist trigger click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(1800, now);
      click.frequency.exponentialRampToValueAtTime(250, now + 0.04);
      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);

      noiseSource.start(now);
      osc.start(now);
      click.start(now);

      // Stop all generators completely to prevent any residual buzzing/humming
      click.stop(now + 0.05);
      noiseSource.stop(now + 0.22);
      osc.stop(now + 0.22);

      // Explicitly set gains to absolute 0
      clickGain.gain.setValueAtTime(0, now + 0.05);
      noiseGain.gain.setValueAtTime(0, now + 0.22);
      oscGain.gain.setValueAtTime(0, now + 0.22);

      // Fully close and clean up the AudioContext after playback finishes
      setTimeout(() => {
        try {
          ctx.close().catch(() => {});
        } catch {}
      }, 260);
    } catch {
      // Audio autoplay gracefully handled
    }
  }, []);

  const handleOpenBox = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setShowWebEffect(true);

    // Play web shooter THWIP sound
    playWebShooterSound();

    // Redirección especial SOLO para vista de teléfono (pantallas menores a 768px)
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobileView) {
      setTimeout(() => {
        setIsOpening(false);
        setShowWebEffect(false);
        router.push('/coleccion/spiderman');
      }, 400);
      return;
    }

    onOpenChange?.(true);

    // Start Post Malone music
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // After animation sequence, reveal the 4 shirts apartado (vista de escritorio)
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      setShowWebEffect(false);
    }, 1150);
  };

  const handleCloseBox = () => {
    // Pause Post Malone music
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsOpen(false);
    setIsOpening(false);
    onOpenChange?.(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen || isOpening) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -14,
      y: (x / (rect.width / 2)) * 14
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = (tee: SpidermanTee) => {
    if (tee.stock <= 0 || tee.availability.toUpperCase() === 'AGOTADO') return;
    addItem({
      id: `${tee.productId}-spiderman-${tee.option}`,
      productId: tee.productId,
      name: `${tee.name} (${tee.brand})`,
      price: tee.priceNum,
      image: tee.image,
      option: tee.option,
      color: 'Colección Marvel',
      quantity: 1
    });

    setAddedItems((prev) => ({ ...prev, [tee.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [tee.id]: false }));
    }, 2200);

    setIsCartOpen(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[16/9] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#070508] via-[#0f090d] to-[#070508] select-none"
    >
      {/* Hidden preloaded assets for immediate instant opening */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        <Image src="/assets/images/spiderman/cajaspider-door-left.webp" alt="preload-left" width={10} height={10} priority />
        <Image src="/assets/images/spiderman/cajaspider-door-right.webp" alt="preload-right" width={10} height={10} priority />
      </div>

      {/* Spider-Man Authentic White Spiderwebs in Banner Background */}
      {/* Top-Right White Spiderweb */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-[440px] md:h-[440px] pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 300 300" fill="none" stroke="#ffffff" strokeWidth="1.4" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]">
          <line x1="300" y1="0" x2="0" y2="0" />
          <line x1="300" y1="0" x2="0" y2="75" />
          <line x1="300" y1="0" x2="0" y2="150" />
          <line x1="300" y1="0" x2="0" y2="225" />
          <line x1="300" y1="0" x2="0" y2="300" />
          <line x1="300" y1="0" x2="75" y2="300" />
          <line x1="300" y1="0" x2="150" y2="300" />
          <line x1="300" y1="0" x2="225" y2="300" />
          <line x1="300" y1="0" x2="300" y2="300" />
          <path d="M 260 0 Q 260 40 300 40" />
          <path d="M 220 0 Q 220 80 300 80" />
          <path d="M 180 0 Q 180 120 300 120" />
          <path d="M 140 0 Q 140 160 300 160" />
          <path d="M 100 0 Q 100 200 300 200" />
          <path d="M 60 0 Q 60 240 300 240" />
          <path d="M 20 0 Q 20 280 300 280" />
        </svg>
      </div>

      {/* Top-Left White Spiderweb */}
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 md:w-[360px] md:h-[360px] pointer-events-none opacity-35 z-0">
        <svg viewBox="0 0 300 300" fill="none" stroke="#ffffff" strokeWidth="1.4" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <line x1="0" y1="0" x2="300" y2="0" />
          <line x1="0" y1="0" x2="300" y2="75" />
          <line x1="0" y1="0" x2="300" y2="150" />
          <line x1="0" y1="0" x2="300" y2="225" />
          <line x1="0" y1="0" x2="300" y2="300" />
          <line x1="0" y1="0" x2="225" y2="300" />
          <line x1="0" y1="0" x2="150" y2="300" />
          <line x1="0" y1="0" x2="75" y2="300" />
          <line x1="0" y1="0" x2="0" y2="300" />
          <path d="M 40 0 Q 40 40 0 40" />
          <path d="M 80 0 Q 80 80 0 80" />
          <path d="M 120 0 Q 120 120 0 120" />
          <path d="M 160 0 Q 160 160 0 160" />
          <path d="M 200 0 Q 200 200 0 200" />
          <path d="M 240 0 Q 240 240 0 240" />
          <path d="M 280 0 Q 280 280 0 280" />
        </svg>
      </div>

      {/* Bottom-Left White Spiderweb */}
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] pointer-events-none opacity-35 z-0">
        <svg viewBox="0 0 300 300" fill="none" stroke="#ffffff" strokeWidth="1.4" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <line x1="0" y1="300" x2="300" y2="300" />
          <line x1="0" y1="300" x2="300" y2="225" />
          <line x1="0" y1="300" x2="300" y2="150" />
          <line x1="0" y1="300" x2="300" y2="75" />
          <line x1="0" y1="300" x2="300" y2="0" />
          <line x1="0" y1="300" x2="225" y2="0" />
          <line x1="0" y1="300" x2="150" y2="0" />
          <line x1="0" y1="300" x2="75" y2="0" />
          <line x1="0" y1="300" x2="0" y2="0" />
          <path d="M 40 300 Q 40 260 0 260" />
          <path d="M 80 300 Q 80 220 0 220" />
          <path d="M 120 300 Q 120 180 0 180" />
          <path d="M 160 300 Q 160 140 0 140" />
          <path d="M 200 300 Q 200 100 0 100" />
          <path d="M 240 300 Q 240 60 0 60" />
          <path d="M 280 300 Q 280 20 0 20" />
        </svg>
      </div>

      {/* Floating White Spider Web Strands / Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
        <svg viewBox="0 0 1000 600" fill="none" stroke="#ffffff" strokeWidth="1" className="w-full h-full">
          <path d="M 0 150 Q 250 200 500 100 T 1000 200" strokeDasharray="6 4" />
          <path d="M 100 600 Q 400 450 700 550 T 1000 480" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Floating Red Embers / Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-ping" />
        <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_15px_#f97316] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_10px_#f87171] animate-bounce" />
        <div className="absolute bottom-1/5 right-1/6 w-2 h-2 rounded-full bg-red-600 shadow-[0_0_16px_#dc2626] animate-pulse" />
      </div>

      {/* Authentic Spider-Man Web Blast FX during opening */}
      <AnimatePresence>
        {showWebEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1, rotate: -20 }}
            animate={{ opacity: 1, scale: [0.1, 1.3, 1.1], rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-80 h-80 sm:w-[480px] sm:h-[480px]">
              <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] drop-shadow-[0_0_28px_rgba(239,68,68,0.85)]">
                {/* Radiating Silk Web Spokes */}
                <motion.path
                  d="M 200 200 L 395.0 200.0 M 200 200 L 368.9 297.5 M 200 200 L 297.5 368.9 M 200 200 L 200.0 395.0 M 200 200 L 102.5 368.9 M 200 200 L 31.1 297.5 M 200 200 L 5.0 200.0 M 200 200 L 31.1 102.5 M 200 200 L 102.5 31.1 M 200 200 L 200.0 5.0 M 200 200 L 297.5 31.1 M 200 200 L 368.9 102.5"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />
                {/* Concentric Scalloped Web Spirals with natural silk curve */}
                <motion.path
                  d="M 235.0 200.0 Q 229.8 208.0 230.3 217.5 Q 221.8 221.8 217.5 230.3 Q 208.0 229.8 200.0 235.0 Q 192.0 229.8 182.5 230.3 Q 178.2 221.8 169.7 217.5 Q 170.2 208.0 165.0 200.0 Q 170.2 192.0 169.7 182.5 Q 178.2 178.2 182.5 169.7 Q 192.0 170.2 200.0 165.0 Q 208.0 170.2 217.5 169.7 Q 221.8 178.2 230.3 182.5 Q 229.8 192.0 235.0 200.0 M 272.0 200.0 Q 261.2 216.4 262.4 236.0 Q 244.8 244.8 236.0 262.4 Q 216.4 261.2 200.0 272.0 Q 183.6 261.2 164.0 262.4 Q 155.2 244.8 137.6 236.0 Q 138.8 216.4 128.0 200.0 Q 138.8 183.6 137.6 164.0 Q 155.2 155.2 164.0 137.6 Q 183.6 138.8 200.0 128.0 Q 216.4 138.8 236.0 137.6 Q 244.8 155.2 262.4 164.0 Q 261.2 183.6 272.0 200.0 M 315.0 200.0 Q 297.8 226.2 299.6 257.5 Q 271.6 271.6 257.5 299.6 Q 226.2 297.8 200.0 315.0 Q 173.8 297.8 142.5 299.6 Q 128.4 271.6 100.4 257.5 Q 102.2 226.2 85.0 200.0 Q 102.2 173.8 100.4 142.5 Q 128.4 128.4 142.5 100.4 Q 173.8 102.2 200.0 85.0 Q 226.2 102.2 257.5 100.4 Q 271.6 128.4 299.6 142.5 Q 297.8 173.8 315.0 200.0 M 355.0 200.0 Q 331.8 235.3 334.2 277.5 Q 296.4 296.4 277.5 334.2 Q 235.3 331.8 200.0 355.0 Q 164.7 331.8 122.5 334.2 Q 103.6 296.4 65.8 277.5 Q 68.2 235.3 45.0 200.0 Q 68.2 164.7 65.8 122.5 Q 103.6 103.6 122.5 65.8 Q 164.7 68.2 200.0 45.0 Q 235.3 68.2 277.5 65.8 Q 296.4 103.6 334.2 122.5 Q 331.8 164.7 355.0 200.0 M 392.0 200.0 Q 363.2 243.7 366.3 296.0 Q 319.5 319.5 296.0 366.3 Q 243.7 363.2 200.0 392.0 Q 156.3 363.2 104.0 366.3 Q 80.5 319.5 33.7 296.0 Q 36.8 243.7 8.0 200.0 Q 36.8 156.3 33.7 104.0 Q 80.5 80.5 104.0 33.7 Q 156.3 36.8 200.0 8.0 Q 243.7 36.8 296.0 33.7 Q 319.5 80.5 366.3 104.0 Q 363.2 156.3 392.0 200.0"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                />
                {/* Central Silk Web Hub Knot */}
                <circle cx="200" cy="200" r="4.5" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BANNER LAYOUT: Matching the user's reference image without background people */}
      {/* BANNER LAYOUT: Matching the user's reference image without background people */}
      {!isOpen && (
        <div className="relative z-10 w-full max-w-7xl px-3 sm:px-6 md:px-12 flex flex-row items-center justify-between gap-2 sm:gap-6 md:gap-12">
          
          {/* Left Column: Branding, Title & Description (No buttons as requested) */}
          <div className="w-[52%] sm:w-1/2 flex flex-col items-start text-left pt-3 sm:pt-0 pl-1 sm:pl-2">
            {/* MARVEL Box Logo */}
            <div className="mb-1 sm:mb-2">
              <span className="bg-[#e50914] px-2 py-0.5 sm:px-4 sm:py-1 rounded text-white font-black text-[10px] sm:text-sm md:text-base tracking-widest shadow-[0_0_12px_rgba(229,9,20,0.8)] inline-block">
                MARVEL
              </span>
            </div>

            {/* SPIDER-MAN Title Logo */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
              SPIDER-MAN
            </h1>

            {/* x CIVIL REGIME */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs xs:text-sm sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide sm:tracking-widest text-zinc-100 my-0.5 sm:my-1">
              <span className="text-red-500 font-bold lowercase text-xs sm:text-lg md:text-2xl">x</span>
              <span className="font-serif tracking-[0.08em] sm:tracking-[0.18em]">CIVIL REGIME</span>
            </div>

            {/* Description Paragraph */}
            <p className="text-[9px] xs:text-[10px] sm:text-sm md:text-base text-zinc-300 font-medium tracking-normal sm:tracking-wide max-w-lg mt-0.5 sm:mt-2 md:mt-4 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              LA FUERZA Y EL ESTILO SE UNEN EN UNA EDICIÓN ÚNICA. DESCUBRE LA COLECCIÓN EXCLUSIVA INSPIRADA EN EL LANZARREDES.
            </p>
          </div>

          {/* Right Column: 3D Box in perspective floating with glowing neon frames (NO PEOPLE) */}
          <div className="w-[48%] sm:w-1/2 flex items-center justify-center relative pr-1">
            
            {/* Glowing Neon Red Backing Frames (replicating the photo frames behind the box) */}
            <div className="absolute w-[130px] h-[155px] xs:w-[150px] xs:h-[180px] sm:w-[280px] sm:h-[340px] md:w-[380px] md:h-[450px] rounded-2xl md:rounded-3xl border border-red-600/70 sm:border-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] rotate-[-8deg] pointer-events-none opacity-70" />
            <div className="absolute w-[130px] h-[155px] xs:w-[150px] xs:h-[180px] sm:w-[280px] sm:h-[340px] md:w-[380px] md:h-[450px] rounded-2xl md:rounded-3xl border border-red-500/50 sm:border-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] rotate-[8deg] pointer-events-none opacity-60" />

            {/* Interactive 3D Box Container */}
            <div
              onClick={handleOpenBox}
              style={{ perspective: '1400px' }}
              className="relative cursor-pointer group py-1 sm:py-2"
            >
              {!isOpening ? (
                /* Idle & Hover State: Authentic 3D Rendered Box with Interactive Tilt */
                <motion.div
                  animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    y: [0, -5, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                    scale: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                    rotateX: { type: 'spring', damping: 20, stiffness: 200 },
                    rotateY: { type: 'spring', damping: 20, stiffness: 200 }
                  }}
                  className="relative w-[140px] h-[140px] xs:w-[160px] xs:h-[160px] sm:w-[280px] sm:h-[280px] md:w-[430px] md:h-[430px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_25px_rgba(220,38,38,0.5)] group-hover:drop-shadow-[0_0_60px_rgba(239,68,68,0.85)] transition-all duration-300"
                >
                  <Image
                    src="/assets/images/spiderman/cajaspider-v3.webp"
                    alt="Caja 3D Spider-Man x Civil Regime"
                    fill
                    priority
                    unoptimized
                    className="object-contain"
                  />
                  {/* Subtle Interactive Sheen Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                </motion.div>
              ) : (
                /* Opening Sequence: 3D Rendered Box Doors Split and Swing Open */
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="relative w-[140px] h-[140px] xs:w-[160px] xs:h-[160px] sm:w-[280px] sm:h-[280px] md:w-[430px] md:h-[430px]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Inner Glowing Vault Interior revealed upon opening */}
                  <div className="absolute inset-4 bg-gradient-to-b from-[#3b0d11] via-black to-zinc-950 rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-red-600/60 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.9)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.6)_0%,transparent_75%)] animate-pulse" />
                    <div className="relative z-10 text-center">
                      <Sparkles className="w-10 h-10 text-red-400 mx-auto mb-2 animate-spin" />
                      <span className="text-white font-black text-xs md:text-sm tracking-[0.2em] uppercase">
                        ABRIENDO VAULT...
                      </span>
                      <span className="block text-red-400 text-[10px] font-mono tracking-wider mt-1">
                        THWIP! 4 PIEZAS DESBLOQUEADAS
                      </span>
                    </div>
                  </div>

                  {/* Left 3D Door Swing */}
                  <motion.div
                    initial={{ rotateY: 0, x: 0 }}
                    animate={{ rotateY: -110, x: -30 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      transformOrigin: '20% 50%',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <Image
                      src="/assets/images/spiderman/cajaspider-door-left-v3.webp"
                      alt="Caja 3D Spider-Man Izquierda"
                      fill
                      priority
                      unoptimized
                      className="object-contain"
                    />
                  </motion.div>

                  {/* Right 3D Door Swing */}
                  <motion.div
                    initial={{ rotateY: 0, x: 0 }}
                    animate={{ rotateY: 110, x: 30 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      transformOrigin: '85% 50%',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <Image
                      src="/assets/images/spiderman/cajaspider-door-right-v3.webp"
                      alt="Caja 3D Spider-Man Derecha"
                      fill
                      priority
                      unoptimized
                      className="object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Floating "Toca para abrir" label */}
              <div className="mt-1 sm:mt-3 md:mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 text-[8px] xs:text-[9px] sm:text-[11px] md:text-xs font-black tracking-wider sm:tracking-widest uppercase shadow-[0_0_12px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400 animate-spin" />
                  TOCA LA CAJA 3D
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APARTADO DE LAS 4 PLAYERAS EXCLUSIVAS (SOLAMENTE ESTAS 4 PIEZAS) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col overflow-y-auto p-3 sm:p-5 md:p-6"
          >
            {/* Top Bar with Post Malone Music Badge and Close Button */}
            <div className="flex items-center justify-between border-b border-red-500/30 pb-3 mb-4 max-w-7xl mx-auto w-full">
              
              {/* Left Brand Badge */}
              <div className="flex items-center gap-3">
                <div className="bg-[#e50914] px-3 py-1 rounded text-white font-black text-xs md:text-sm tracking-widest shadow-[0_0_15px_rgba(229,9,20,0.8)]">
                  MARVEL
                </div>
                <div>
                  <h3 className="text-white font-black text-sm md:text-lg tracking-wider uppercase flex items-center gap-2">
                    SPIDER-MAN × CIVIL REGIME
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-red-950 border border-red-500 text-red-400 font-mono">
                      4 PIEZAS
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-[10px] sm:text-xs">
                    Colección oficial · Estilo de cuadro oficial Zona Fit
                  </p>
                </div>
              </div>

              {/* Music Player Indicator (Post Malone - Sunflower) & Close Button */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Music Badge with Equalizer */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-200 text-xs font-mono transition-colors"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      {/* Animated mini equalizer bars */}
                      <span className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 h-3 bg-red-500 animate-[pulse_0.6s_ease-in-out_infinite]" />
                        <span className="w-0.5 h-2 bg-red-400 animate-[pulse_0.4s_ease-in-out_infinite]" />
                        <span className="w-0.5 h-3.5 bg-red-500 animate-[pulse_0.8s_ease-in-out_infinite]" />
                      </span>
                    </>
                  )}
                  <span className="hidden md:inline text-[11px] font-bold text-red-300">
                    Sunflower · Post Malone
                  </span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseBox}
                  className="group flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <span>Cerrar caja</span>
                  <X className="w-4 h-4 text-red-500 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* 4 PRODUCT CARDS WITH THE EXACT STYLE FROM USER'S PHOTO 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto w-full flex-1 items-stretch">
              {SPIDERMAN_TEES.map((tee, index) => (
                <motion.div
                  key={tee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  style={{
                    backgroundColor: '#0d0d0d',
                    backgroundImage: `linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000), linear-gradient(-45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000)`,
                    backgroundSize: '20px 20px',
                    borderColor: '#e50914',
                  }}
                  className="relative rounded-lg border-2 p-3 sm:p-4 flex flex-col justify-between text-center shadow-[0_0_15px_rgba(229,9,20,0.35)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] transition-all duration-200 group"
                  onMouseEnter={() => setHoveredCardId(tee.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  {/* Product Image in Center with square/contain proportions and touch-to-enlarge */}
                  <div
                    onClick={() => setEnlargedTee({ tee, isBack: hoveredCardId === tee.id })}
                    className="relative w-full aspect-square rounded-md overflow-hidden bg-black/40 mb-3 flex items-center justify-center p-2 cursor-zoom-in group/img"
                    title="Toca para agrandar la imagen en alta resolución"
                  >
                    <Image
                      src={hoveredCardId === tee.id ? tee.image2 : tee.image}
                      alt={tee.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge indicating size M */}
                    <div className="absolute top-2 right-2 bg-black/80 border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10">
                      TALLA M
                    </div>

                    {/* Touch / Click to Enlarge hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                        <Eye className="w-3 h-3" />
                        Toca para agrandar
                      </span>
                    </div>
                  </div>

                  {/* Product Info matching the exact card style in Photo 2 */}
                  <div className="flex flex-col items-center flex-grow">
                    {/* Brand in green */}
                    <p className="text-emerald-500 font-bold uppercase tracking-wider text-xs mb-1">
                      {tee.brand}
                    </p>

                    {/* Product Name in clean white uppercase */}
                    <h4 className="text-white font-normal uppercase tracking-wide text-xs sm:text-sm line-clamp-2 min-h-[36px] flex items-center justify-center">
                      {tee.name}
                    </h4>

                    {/* Price in vibrant red */}
                    <p className="text-[#e50914] font-bold text-base sm:text-lg my-1.5 tracking-tight">
                      {tee.price}
                    </p>

                    {/* Availability Badge: green pill or zinc sold out pill */}
                    <div className="my-1">
                      {tee.stock > 0 && tee.availability.toUpperCase() !== 'AGOTADO' ? (
                        <span className="bg-[#16a34a] text-white text-[11px] font-bold uppercase px-3 py-1 rounded inline-block tracking-wider">
                          DISPONIBLE
                        </span>
                      ) : (
                        <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-bold uppercase px-3 py-1 rounded inline-block tracking-wider">
                          AGOTADO
                        </span>
                      )}
                    </div>

                    {/* Available units subtitle */}
                    <p className="text-zinc-400 text-[11px] sm:text-xs mt-2 mb-3">
                      {tee.stock > 0 && tee.availability.toUpperCase() !== 'AGOTADO'
                        ? `Disponible: ${tee.stock} unidad`
                        : 'Agotado (0 unidades)'}
                    </p>
                  </div>

                  {/* Bottom Action: AGREGAR Button ONLY (Disabled if AGOTADO) */}
                  <div className="mt-auto pt-1 w-full">
                    {tee.stock > 0 && tee.availability.toUpperCase() !== 'AGOTADO' ? (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(tee)}
                        className="w-full py-2.5 rounded bg-[#e50914] hover:bg-[#c40811] text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        {addedItems[tee.id] ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>¡AGREGADO!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-white" />
                            <span>AGREGAR</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 rounded bg-zinc-800/90 text-zinc-500 font-black text-xs sm:text-sm tracking-widest uppercase cursor-not-allowed border border-zinc-700/50 flex items-center justify-center gap-1.5"
                      >
                        AGOTADO
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Bar: Back to Banner */}
            <div className="mt-3 pt-2 border-t border-zinc-800 max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] text-zinc-400">
              <span>* Colección cápsula oficial · Edición limitada Spider-Man.</span>
              <button
                type="button"
                onClick={handleCloseBox}
                className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider"
              >
                ← Volver al banner
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIGH-RESOLUTION ENLARGED IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {enlargedTee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
            onClick={() => setEnlargedTee(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0a0a0c] border-2 border-red-600/80 rounded-2xl shadow-[0_0_60px_rgba(229,9,20,0.5)] overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-950/80">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="bg-[#e50914] px-2.5 py-0.5 rounded text-white font-black text-xs tracking-widest uppercase">
                    MARVEL
                  </span>
                  <div>
                    <h3 className="text-white font-black text-sm sm:text-base tracking-wide uppercase">
                      {enlargedTee.tee.name}
                    </h3>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      {enlargedTee.tee.brand} · TALLA M (1 UNIDAD)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnlargedTee(null)}
                  className="p-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-colors"
                  title="Cerrar"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* View Toggle Tabs: Front vs Back */}
              <div className="flex items-center justify-center gap-2 pt-3 pb-1 bg-zinc-950/40">
                <button
                  type="button"
                  onClick={() => setEnlargedTee((prev) => prev ? { ...prev, isBack: false } : null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                    !enlargedTee.isBack
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Vista Frontal
                </button>
                <button
                  type="button"
                  onClick={() => setEnlargedTee((prev) => prev ? { ...prev, isBack: true } : null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                    enlargedTee.isBack
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Vista Posterior
                </button>
              </div>

              {/* High-Resolution Enlarge Container */}
              <div
                style={{
                  backgroundImage: `linear-gradient(45deg, #050505 25%, transparent 25%, transparent 75%, #050505 75%, #050505), linear-gradient(-45deg, #050505 25%, transparent 25%, transparent 75%, #050505 75%, #050505)`,
                  backgroundSize: '24px 24px',
                  backgroundColor: '#0f0f12'
                }}
                className="relative w-full h-[45vh] sm:h-[55vh] flex items-center justify-center p-4 overflow-hidden"
              >
                <motion.div
                  key={enlargedTee.isBack ? 'back' : 'front'}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={enlargedTee.isBack ? enlargedTee.tee.image2 : enlargedTee.tee.image}
                    alt={`${enlargedTee.tee.name} en alta resolución`}
                    fill
                    unoptimized
                    priority
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-zinc-950 border-t border-zinc-800">
                <div className="text-center sm:text-left">
                  <div className="text-[#e50914] font-black text-xl sm:text-2xl tracking-tight">
                    {enlargedTee.tee.price}
                  </div>
                  <div className="text-zinc-400 text-xs">
                    Edición Limitada Spider-Man · Talla M
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(enlargedTee.tee);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#e50914] hover:bg-[#c40811] text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {addedItems[enlargedTee.tee.id] ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>¡AGREGADO AL CARRITO!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>AGREGAR AL CARRITO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
