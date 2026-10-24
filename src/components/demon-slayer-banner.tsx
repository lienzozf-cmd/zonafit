'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ShoppingBag, Check, Eye, Flame, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export interface DemonSlayerProduct {
  id: string;
  productId: number;
  name: string;
  brand: 'DARC SPORT' | 'YOUNGLA';
  price: string;
  priceNum: number;
  image: string;
  image2?: string;
  availability: 'DISPONIBLE' | 'AGOTADO';
  stock: number;
  size: string;
  character: string;
  tag: string;
}

const DEMON_SLAYER_PRODUCTS: DemonSlayerProduct[] = [
  // --- DARC SPORT ---
  {
    id: 'tanjiro-darc',
    productId: 2667,
    name: 'Tanjiro Series Premium Tee in Black',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    image: '/assets/images/marcas/darcsport/tanjiro.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'S',
    character: 'Tanjiro Kamado',
    tag: 'Respiración de Agua'
  },
  {
    id: 'nezuko-darc',
    productId: 2668,
    name: 'Nezuko Series Premium Tee in Black',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    image: '/assets/images/marcas/darcsport/nezuko.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'S',
    character: 'Nezuko Kamado',
    tag: 'Fuego Demoníaco'
  },
  {
    id: 'inosuke-darc',
    productId: 2666,
    name: 'Inosuke Series Premium Tee in Black',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    image: '/assets/images/marcas/darcsport/inosuke.webp',
    availability: 'AGOTADO',
    stock: 0,
    size: 'M',
    character: 'Inosuke Hashibira',
    tag: 'Respiración de la Bestia'
  },
  {
    id: 'zenitsu-darc',
    productId: 2669,
    name: 'Zenitsu Series Premium Tee in Black',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    image: '/assets/images/marcas/darcsport/zenitsu.webp',
    availability: 'AGOTADO',
    stock: 0,
    size: 'M',
    character: 'Zenitsu Agatsuma',
    tag: 'Respiración del Rayo'
  },
  {
    id: 'uzui-darc',
    productId: 2672,
    name: 'BREATH OF WOLVES LONDON UZUI',
    brand: 'DARC SPORT',
    price: 'Q.670.00',
    priceNum: 670,
    image: '/assets/images/marcas/darcsport/uzuidarc.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'M',
    character: 'Tengen Uzui',
    tag: 'Pilar del Sonido'
  },

  // --- YOUNGLA ---
  {
    id: 'youngla-4266',
    productId: 9106,
    name: '4266 - Demon Slayer: Kimetsu no Yaiba - Character Tees',
    brand: 'YOUNGLA',
    price: 'Q.545.00',
    priceNum: 545,
    image: '/assets/images/marcas/youngla/hombre/4266 - Demon Slayer- Kimetsu no Yaiba - Character Tees swordsmen duo.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'M',
    character: 'Swordsmen Duo',
    tag: 'Tanjiro & Tomioka'
  },
  {
    id: 'youngla-4297',
    productId: 9107,
    name: '4297 - Demon Slayer: Kimetsu no Yaiba - Anime Tees',
    brand: 'YOUNGLA',
    price: 'Q.545.00',
    priceNum: 545,
    image: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees set your heart ablaze.webp',
    image2: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees hinokami kagura.webp',
    availability: 'DISPONIBLE',
    stock: 3,
    size: 'M / L',
    character: 'Kyojuro Rengoku',
    tag: 'Set Your Heart Ablaze'
  },
  {
    id: 'youngla-5195',
    productId: 3054,
    name: '5195 - Demon Slayer: Kimetsu no Yaiba - Zip-ups',
    brand: 'YOUNGLA',
    price: 'Q.700.00',
    priceNum: 700,
    image: '/assets/images/marcas/youngla/hombre/5195 - Demon Slayer zip ups nezuko.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'M',
    character: 'Nezuko Special Zip-Up',
    tag: 'Edición Limitada'
  }
];

interface DemonSlayerBannerProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export default function DemonSlayerBanner({ onOpenChange }: DemonSlayerBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState<'ALL' | 'DARC SPORT' | 'YOUNGLA'>('ALL');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [enlargedProduct, setEnlargedProduct] = useState<DemonSlayerProduct | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  useEffect(() => {
    audioRef.current = new Audio('/Demon Slayer - Opening .mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.55;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen || isOpening) return;
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
    setIsOpening(true);

    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      window.dispatchEvent(new CustomEvent('pause-background-music'));
    }

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      onOpenChange?.(true);
    }, 900);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.dispatchEvent(new CustomEvent('resume-background-music'));

    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleAddToCart = (item: DemonSlayerProduct) => {
    if (item.stock <= 0 || item.availability === 'AGOTADO') return;
    addItem({
      id: `${item.productId}-demonslayer-${item.size.replace(/\s+/g, '')}`,
      productId: item.productId,
      name: `${item.name} (${item.brand})`,
      price: item.priceNum,
      image: item.image,
      option: item.size,
      color: 'Edición Demon Slayer',
      quantity: 1
    });

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);

    setIsCartOpen(true);
  };

  const filteredProducts = DEMON_SLAYER_PRODUCTS.filter((item) => {
    if (activeBrandFilter === 'ALL') return true;
    return item.brand === activeBrandFilter;
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[16/9] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#040806] via-[#0b1410] to-[#040806] select-none"
      style={{
        minHeight: '400px'
      }}
    >
      {/* Background Japanese Ichimatsu (Checkered) & Katana Slash Atmosphere */}
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

      {/* =========================================================================
          VIEW A: CLOSED HERO BANNER
          ========================================================================= */}
      {!isOpen && (
        <div className="relative z-10 w-full h-full flex flex-row items-center justify-between px-3 xs:px-6 sm:px-10 md:px-16 py-3 sm:py-6">
          
          {/* Left Column: Demon Slayer Typography, Brands & Story */}
          <div className="w-[52%] sm:w-1/2 flex flex-col justify-center items-start text-left z-20">
            
            {/* Top Japanese Kanji / Anime Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.35)] backdrop-blur-md mb-2 sm:mb-4">
              <Flame className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400">
                鬼滅の刃 · COLECCIÓN ANIME
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
              RESPIRA. ENTRENA. TRASCIENDE. DESCUBRE LAS 8 PIEZAS EXCLUSIVAS DE TANJIRO, NEZUKO, INOSUKE, ZENITSU, UZUI Y RENGOKU.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-6">
              <button
                type="button"
                onClick={handleOpen}
                className="px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 via-red-600 to-emerald-600 hover:from-emerald-500 hover:to-red-500 text-white font-black text-[10px] xs:text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                <span>EXPLORAR COLECCIÓN</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[9px] sm:text-[10px] font-mono">8 PIEZAS</span>
              </button>

              <Link
                href="/anime"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-bold uppercase tracking-wider transition-colors"
              >
                <span>Ver catálogo anime</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-500" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Perspective Demon Slayer Emblem Vault (Replacing the box) */}
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
                /* Opening Sequence: Katana Slash & Nichirin Flame Burst */
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.15 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="relative w-[150px] h-[100px] xs:w-[180px] xs:h-[120px] sm:w-[300px] sm:h-[190px] md:w-[420px] md:h-[250px] flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a2318] via-black to-[#280a0d] rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.9)] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.7)_0%,transparent_75%)] animate-pulse" />
                    <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-spin" />
                    <span className="text-white font-black text-xs md:text-sm tracking-[0.2em] uppercase">
                      DESENVAYINANDO...
                    </span>
                    <span className="block text-red-400 text-[10px] font-mono tracking-wider mt-1">
                      8 PIEZAS DESBLOQUEADAS
                    </span>

                    {/* Katana Slash Beam Line */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '150%', opacity: [0, 1, 0] }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute h-[3px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[-35deg] shadow-[0_0_20px_#fff]"
                    />
                  </div>
                </motion.div>
              )}

              {/* Floating "Toca para abrir" label */}
              <div className="mt-1 sm:mt-3 flex justify-center">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-[8px] xs:text-[9px] sm:text-[11px] md:text-xs font-black tracking-wider sm:tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400 animate-spin" />
                  <span>TOCA PARA ABRIR LA COLECCIÓN</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW B: OPEN COLLECTION DRAWER / VAULT (ALL 8 DEMON SLAYER PRODUCTS)
          ========================================================================= */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-30 w-full h-full bg-[#050907] flex flex-col p-3 sm:p-5 md:p-6 overflow-y-auto"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, #0d281a 0%, #050907 80%)`
          }}
        >
          {/* Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-emerald-500/30 pb-2.5 mb-3 max-w-7xl mx-auto w-full gap-2">
            
            {/* Left Brand Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/assets/images/demon slayer/logodemonslayer.webp"
                  alt="Emblema Demon Slayer"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-black text-xs sm:text-base md:text-lg tracking-wider uppercase flex items-center gap-2">
                  DEMON SLAYER · 鬼滅の刃
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono">
                    8 PIEZAS
                  </span>
                </h3>
                <p className="text-zinc-400 text-[9px] sm:text-xs">
                  Colaboración Darc Sport & YoungLA · Zona Fit Oficial
                </p>
              </div>
            </div>

            {/* Filter Pills: ALL / DARC SPORT / YOUNGLA */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveBrandFilter('ALL')}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeBrandFilter === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                Todas (8)
              </button>
              <button
                type="button"
                onClick={() => setActiveBrandFilter('DARC SPORT')}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeBrandFilter === 'DARC SPORT'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                Darc Sport (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveBrandFilter('YOUNGLA')}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeBrandFilter === 'YOUNGLA'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                YoungLA (3)
              </button>

              {/* Audio Toggle Button */}
              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-300 text-[10px] font-mono transition-colors cursor-pointer"
                title={isMuted ? 'Activar música' : 'Silenciar música'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="flex items-end gap-0.5 h-2.5">
                      <span className="w-0.5 h-2.5 bg-emerald-500 animate-[pulse_0.6s_ease-in-out_infinite]" />
                      <span className="w-0.5 h-1.5 bg-emerald-400 animate-[pulse_0.4s_ease-in-out_infinite]" />
                      <span className="w-0.5 h-3 bg-emerald-500 animate-[pulse_0.8s_ease-in-out_infinite]" />
                    </span>
                  </>
                )}
                <span className="hidden md:inline font-bold text-emerald-300 text-[10px]">
                  Opening Theme · LiSA
                </span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="ml-1 sm:ml-2 group flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
              >
                <span>Cerrar</span>
                <X className="w-3.5 h-3.5 text-red-500 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Grid of Demon Slayer Products (Responsive 2 cols on mobile, 4 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-7xl mx-auto w-full flex-1 items-stretch pb-2">
            {filteredProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="relative rounded-lg border-2 p-2.5 sm:p-3.5 flex flex-col justify-between text-center transition-all duration-200 group bg-[#090d0b] border-emerald-900/60 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                style={{
                  backgroundImage: `linear-gradient(45deg, #050806 25%, transparent 25%, transparent 75%, #050806 75%, #050806), linear-gradient(-45deg, #050806 25%, transparent 25%, transparent 75%, #050806 75%, #050806)`,
                  backgroundSize: '16px 16px'
                }}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                {/* Product Image Box */}
                <div
                  onClick={() => setEnlargedProduct(item)}
                  className="relative w-full aspect-square rounded-md overflow-hidden bg-black/60 mb-2 flex items-center justify-center p-1 cursor-zoom-in group/img"
                  title="Toca para agrandar"
                >
                  <Image
                    src={hoveredCardId === item.id && item.image2 ? item.image2 : item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Size & Tag Badges */}
                  <div className="absolute top-1.5 right-1.5 bg-black/85 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 font-mono">
                    TALLA {item.size}
                  </div>

                  <div className="absolute top-1.5 left-1.5 bg-red-950/90 border border-red-500/50 text-red-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow z-10 uppercase">
                    {item.character}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <span className="px-2 py-1 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                      <Eye className="w-3 h-3" />
                      Agrandar
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col items-center flex-grow">
                  <p className="text-emerald-400 font-extrabold uppercase tracking-wider text-[10px] sm:text-xs mb-0.5">
                    {item.brand}
                  </p>

                  <h4 className="text-white font-medium uppercase tracking-tight text-[11px] sm:text-xs line-clamp-2 min-h-[30px] flex items-center justify-center leading-tight">
                    {item.name}
                  </h4>

                  <p className="text-red-500 font-black text-sm sm:text-base my-1 tracking-tight">
                    {item.price}
                  </p>

                  {/* Availability Badge */}
                  <div className="my-0.5">
                    {item.stock > 0 && item.availability === 'DISPONIBLE' ? (
                      <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded inline-block tracking-wider">
                        DISPONIBLE ({item.stock})
                      </span>
                    ) : (
                      <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded inline-block tracking-wider">
                        AGOTADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-2 pt-1 w-full">
                  {item.stock > 0 && item.availability === 'DISPONIBLE' ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 rounded bg-gradient-to-r from-emerald-600 to-red-600 hover:from-emerald-500 hover:to-red-500 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {addedItems[item.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>¡AGREGADO!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>AGREGAR</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 rounded bg-zinc-800/80 text-zinc-500 font-bold text-[11px] uppercase tracking-wider cursor-not-allowed border border-zinc-700/50"
                    >
                      AGOTADO
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="pt-2 text-center">
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 uppercase tracking-widest transition-colors"
            >
              <span>Ver todos los productos de la colección Anime</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          VIEW C: FULL-RESOLUTION ENLARGED IMAGE MODAL
          ========================================================================= */}
      <AnimatePresence>
        {enlargedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedProduct(null)}
            className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full bg-[#0a0f0d] border border-emerald-500/50 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] flex flex-col items-center cursor-default"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => setEnlargedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                {enlargedProduct.brand} · {enlargedProduct.character}
              </span>

              <h3 className="text-white font-black text-sm sm:text-base text-center uppercase tracking-tight mb-3">
                {enlargedProduct.name}
              </h3>

              {/* Large Image Box */}
              <div className="relative w-full aspect-square max-h-[380px] bg-black/60 rounded-xl overflow-hidden mb-4">
                <Image
                  src={enlargedProduct.image}
                  alt={enlargedProduct.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="w-full flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-xs block">Precio oficial:</span>
                  <span className="text-red-500 font-black text-lg">{enlargedProduct.price}</span>
                </div>

                <div className="flex gap-2">
                  {enlargedProduct.stock > 0 && enlargedProduct.availability === 'DISPONIBLE' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart(enlargedProduct);
                        setEnlargedProduct(null);
                      }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-red-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
