'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, Eye, X, Volume2, VolumeX, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCartStore } from '@/stores/cart-store';

interface DemonSlayerItem {
  id: string;
  productId: number;
  name: string;
  shortName: string;
  brand: 'DARC SPORT' | 'YOUNGLA';
  price: string;
  priceNum: number;
  imageFront: string;
  imageBack?: string;
  availability: 'DISPONIBLE' | 'AGOTADO';
  stock: number;
  size: string;
  character: string;
  description: string;
}

const ITEMS: DemonSlayerItem[] = [
  // --- DARC SPORT ---
  {
    id: 'tanjiro-darc',
    productId: 2667,
    name: 'Tanjiro Series Premium Tee in Black',
    shortName: 'Tanjiro Series Premium Tee',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    imageFront: '/assets/images/marcas/darcsport/tanjiro.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'S',
    character: 'Tanjiro Kamado',
    description: 'Prenda oficial de alto rendimiento Darc Sport x Demon Slayer. Gráfico exclusivo de Tanjiro Kamado con tecnología de secado rápido y algodón ultra resistente.'
  },
  {
    id: 'nezuko-darc',
    productId: 2668,
    name: 'Nezuko Series Premium Tee in Black',
    shortName: 'Nezuko Series Premium Tee',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    imageFront: '/assets/images/marcas/darcsport/nezuko.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'S',
    character: 'Nezuko Kamado',
    description: 'Edición limitada Nezuko Kamado en corte atlético que realza la figura. Impresión de alta fidelidad y máxima transpirabilidad.'
  },
  {
    id: 'inosuke-darc',
    productId: 2666,
    name: 'Inosuke Series Premium Tee in Black',
    shortName: 'Inosuke Series Premium Tee',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    imageFront: '/assets/images/marcas/darcsport/inosuke.webp',
    availability: 'AGOTADO',
    stock: 0,
    size: 'M',
    character: 'Inosuke Hashibira',
    description: 'Tributo salvaje a Inosuke Hashibira. Confección en 100% algodón pesado de primera calidad con ajuste relajado.'
  },
  {
    id: 'zenitsu-darc',
    productId: 2669,
    name: 'Zenitsu Series Premium Tee in Black',
    shortName: 'Zenitsu Series Premium Tee',
    brand: 'DARC SPORT',
    price: 'Q.595.00',
    priceNum: 595,
    imageFront: '/assets/images/marcas/darcsport/zenitsu.webp',
    availability: 'AGOTADO',
    stock: 0,
    size: 'M',
    character: 'Zenitsu Agatsuma',
    description: 'Diseño electrizante de Zenitsu Agatsuma: Respiración del Rayo Primera Postura. Gráficos de colección de alto impacto visual.'
  },
  {
    id: 'uzui-darc',
    productId: 2672,
    name: 'BREATH OF WOLVES LONDON UZUI',
    shortName: 'Breath of Wolves London Uzui',
    brand: 'DARC SPORT',
    price: 'Q.670.00',
    priceNum: 670,
    imageFront: '/assets/images/marcas/darcsport/uzuidarc.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'M',
    character: 'Tengen Uzui',
    description: 'El Pilar del Sonido Tengen Uzui en colaboración especial Wolves. Corte oversized extravagante con diseño de lujo en tinta brillante.'
  },

  // --- YOUNGLA ---
  {
    id: 'youngla-4266',
    productId: 9106,
    name: '4266 - Demon Slayer: Kimetsu no Yaiba - Character Tees',
    shortName: '4266 Swordsmen Duo Tee',
    brand: 'YOUNGLA',
    price: 'Q.545.00',
    priceNum: 545,
    imageFront: '/assets/images/marcas/youngla/hombre/4266 - Demon Slayer- Kimetsu no Yaiba - Character Tees swordsmen duo.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    size: 'M',
    character: 'Swordsmen Duo',
    description: 'Playera oficial YoungLA Anime Collection con estampado de alta densidad Swordsmen Duo en suave algodón premium heavyweight.'
  },
  {
    id: 'youngla-4297',
    productId: 9107,
    name: '4297 - Demon Slayer: Kimetsu no Yaiba - Anime Tees',
    shortName: '4297 Anime Tees (Rengoku & Tanjiro)',
    brand: 'YOUNGLA',
    price: 'Q.545.00',
    priceNum: 545,
    imageFront: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees set your heart ablaze.webp',
    imageBack: '/assets/images/marcas/youngla/hombre/4297 - Demon Slayer- Kimetsu no Yaiba - Anime Tees hinokami kagura.webp',
    availability: 'DISPONIBLE',
    stock: 3,
    size: 'M / L',
    character: 'Kyojuro Rengoku',
    description: 'Playera gráfica doble edición especial YoungLA: Set Your Heart Ablaze & Hinokami Kagura. Confección en algodón 100% transpirable.'
  },
  {
    id: 'youngla-5195',
    productId: 3054,
    name: '5195 - Demon Slayer: Kimetsu no Yaiba - Zip-ups',
    shortName: '5195 Nezuko Zip-Up Hoodie',
    brand: 'YOUNGLA',
    price: 'Q.700.00',
    priceNum: 700,
    imageFront: '/assets/images/marcas/youngla/hombre/5195 - Demon Slayer zip ups nezuko.webp',
    availability: 'AGOTADO',
    stock: 0,
    size: 'M',
    character: 'Nezuko Zip-Up',
    description: 'Chaqueta de cremallera Demon Slayer oficial YoungLA. Forro polar ultra suave, bordados exclusivos y detalles premium inspirados en Nezuko.'
  }
];

export default function DemonSlayerColeccionPage() {
  const [activeBrandFilter, setActiveBrandFilter] = useState<'ALL' | 'DARC SPORT' | 'YOUNGLA'>('ALL');
  const [selectedViews, setSelectedViews] = useState<Record<string, 'front' | 'back'>>({
    'youngla-4297': 'front'
  });
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [enlargedItem, setEnlargedItem] = useState<{ item: DemonSlayerItem; isBack: boolean } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  // Initialize Demon Slayer Opening track
  useEffect(() => {
    const audio = new Audio('/Demon Slayer - Opening .mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    // Try auto-play
    audio.play()
      .then(() => {
        setIsPlaying(true);
        window.dispatchEvent(new CustomEvent('pause-background-music'));
      })
      .catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.currentTime = 0;
      window.dispatchEvent(new CustomEvent('resume-background-music'));
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        window.dispatchEvent(new CustomEvent('pause-background-music'));
      }).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
      window.dispatchEvent(new CustomEvent('resume-background-music'));
    }
  };

  const handleToggleView = (id: string, view: 'front' | 'back') => {
    setSelectedViews((prev) => ({ ...prev, [id]: view }));
  };

  const handleAddToCart = (item: DemonSlayerItem) => {
    if (item.stock <= 0 || item.availability === 'AGOTADO') return;
    addItem({
      id: `${item.productId}-demonslayer-${item.size.replace(/\s+/g, '')}`,
      productId: item.productId,
      name: `${item.name} (${item.brand})`,
      price: item.priceNum,
      image: item.imageFront,
      option: item.size,
      color: 'Colección Demon Slayer',
      quantity: 1
    });

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2200);

    setIsCartOpen(true);
  };

  const filteredItems = ITEMS.filter((item) => {
    if (activeBrandFilter === 'ALL') return true;
    return item.brand === activeBrandFilter;
  });

  return (
    <div className="min-h-screen bg-[#040806] text-white flex flex-col selection:bg-emerald-600 selection:text-white">
      <Header />

      {/* Background Japanese Ichimatsu & Glow Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
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
      <div className="fixed top-20 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 w-full">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500 transition-all text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Volver a la Tienda</span>
          </Link>

          {/* Opening Music Player Pill */}
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 text-xs font-mono transition-all backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
            title={isPlaying ? 'Silenciar música' : 'Reproducir música'}
          >
            {isPlaying && !isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-emerald-500 animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2 bg-emerald-400 animate-[pulse_0.4s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-3.5 bg-emerald-500 animate-[pulse_0.8s_ease-in-out_infinite]" />
                </span>
                <span className="font-bold tracking-wider">Gurenge · LiSA (Reproduciendo)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400 font-bold tracking-wider">Activar Opening</span>
              </>
            )}
          </button>
        </div>

        {/* HERO SECTION WITH DEMON SLAYER LOGO */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-[#091811] via-[#050a08] to-[#040806] p-6 sm:p-10 md:p-12 mb-10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-red-600/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-emerald-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-4">
                <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  鬼滅の刃 · APARTADO EXCLUSIVO ZONA FIT
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-none">
                DEMON SLAYER
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-base sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide text-zinc-100 my-2">
                <span className="text-emerald-400 font-serif tracking-widest">DARC SPORT</span>
                <span className="text-red-500 font-bold lowercase text-base sm:text-xl">×</span>
                <span className="text-zinc-200 tracking-wider">YOUNGLA</span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm md:text-base font-medium max-w-xl leading-relaxed mt-2">
                Colección completa oficial de Kimetsu no Yaiba. Confección de alto gramaje, impresiones de colección de alta densidad y cortes deportivos inspirados en los cazadores y pilares más emblemáticos.
              </p>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Auténtico y Oficial
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-zinc-300 text-xs font-mono">
                  8 Prendas Únicas
                </span>
              </div>
            </div>

            {/* Right Emblem Illustration */}
            <div className="relative w-64 h-36 sm:w-80 sm:h-44 md:w-96 md:h-52 filter drop-shadow-[0_10px_30px_rgba(16,185,129,0.4)]">
              <Image
                src="/assets/images/demon slayer/logodemonslayer.webp"
                alt="Demon Slayer Logo Oficial"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* BRAND FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-2">Filtrar por marca:</span>
            <button
              type="button"
              onClick={() => setActiveBrandFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeBrandFilter === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              Todas (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveBrandFilter('DARC SPORT')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeBrandFilter === 'DARC SPORT'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              Darc Sport (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveBrandFilter('YOUNGLA')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeBrandFilter === 'YOUNGLA'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              YoungLA (3)
            </button>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            Mostrando {filteredItems.length} prendas
          </span>
        </div>

        {/* 8 PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredItems.map((item) => {
            const currentView = selectedViews[item.id] || 'front';
            const currentImage = currentView === 'back' && item.imageBack ? item.imageBack : item.imageFront;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl border-2 border-emerald-950/70 hover:border-emerald-500 bg-[#070b09] p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] group"
                style={{
                  backgroundImage: `linear-gradient(45deg, #040806 25%, transparent 25%, transparent 75%, #040806 75%, #040806), linear-gradient(-45deg, #040806 25%, transparent 25%, transparent 75%, #040806 75%, #040806)`,
                  backgroundSize: '20px 20px'
                }}
              >
                {/* Image Container with Zoom */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/60 mb-3 flex items-center justify-center p-2">
                  <div
                    onClick={() => setEnlargedItem({ item, isBack: currentView === 'back' })}
                    className="relative w-full h-full cursor-zoom-in"
                    title="Toca para ampliar en alta resolución"
                  >
                    <Image
                      src={currentImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Badges on Image */}
                  <div className="absolute top-2.5 right-2.5 bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow z-10 font-mono">
                    TALLA {item.size}
                  </div>

                  <div className="absolute top-2.5 left-2.5 bg-red-950/90 border border-red-500/50 text-red-200 text-[9px] font-bold px-2 py-0.5 rounded-md shadow z-10 uppercase">
                    {item.character}
                  </div>

                  {/* Zoom indicator button */}
                  <button
                    type="button"
                    onClick={() => setEnlargedItem({ item, isBack: currentView === 'back' })}
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-white hover:border-emerald-500 transition-colors shadow z-10 cursor-pointer"
                    title="Ampliar foto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Switcher for items with multiple images */}
                {item.imageBack && (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleToggleView(item.id, 'front')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        currentView === 'front'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Set Your Heart Ablaze
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleView(item.id, 'back')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        currentView === 'back'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Hinokami Kagura
                    </button>
                  </div>
                )}

                {/* Product Details */}
                <div className="flex flex-col items-center text-center flex-grow">
                  <p className="text-emerald-400 font-extrabold uppercase tracking-wider text-xs mb-1">
                    {item.brand}
                  </p>

                  <h3 className="text-white font-bold uppercase tracking-tight text-sm line-clamp-2 min-h-[40px] flex items-center justify-center">
                    {item.name}
                  </h3>

                  <p className="text-red-500 font-black text-lg my-1.5 tracking-tight">
                    {item.price}
                  </p>

                  {/* Availability Badge */}
                  <div className="my-1">
                    {item.stock > 0 && item.availability === 'DISPONIBLE' ? (
                      <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded inline-block tracking-wider">
                        DISPONIBLE ({item.stock})
                      </span>
                    ) : (
                      <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-bold uppercase px-3 py-1 rounded inline-block tracking-wider">
                        AGOTADO
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 text-[11px] mt-2 mb-4 line-clamp-2 px-1">
                    {item.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-2 w-full flex flex-col gap-2">
                  {item.stock > 0 && item.availability === 'DISPONIBLE' ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 via-red-600 to-emerald-600 hover:from-emerald-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {addedItems[item.id] ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>¡AGREGADO AL CARRITO!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>AGREGAR AL CARRITO</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-lg bg-zinc-800/80 text-zinc-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed border border-zinc-700/50"
                    >
                      AGOTADO
                    </button>
                  )}

                  <Link
                    href={`/product/${item.productId}`}
                    className="w-full py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold text-[11px] uppercase tracking-wider text-center transition-colors"
                  >
                    Ver detalles del producto
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* FULL-RESOLUTION ENLARGED MODAL */}
      <AnimatePresence>
        {enlargedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedItem(null)}
            className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full bg-[#0a0f0d] border border-emerald-500/50 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] flex flex-col items-center cursor-default"
            >
              <button
                type="button"
                onClick={() => setEnlargedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                {enlargedItem.item.brand} · {enlargedItem.item.character}
              </span>

              <h3 className="text-white font-black text-sm sm:text-base text-center uppercase tracking-tight mb-3">
                {enlargedItem.item.name}
              </h3>

              <div className="relative w-full aspect-square max-h-[400px] bg-black/60 rounded-xl overflow-hidden mb-4">
                <Image
                  src={enlargedItem.isBack && enlargedItem.item.imageBack ? enlargedItem.item.imageBack : enlargedItem.item.imageFront}
                  alt={enlargedItem.item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="w-full flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-xs block">Precio oficial:</span>
                  <span className="text-red-500 font-black text-lg">{enlargedItem.item.price}</span>
                </div>

                <div className="flex gap-2">
                  {enlargedItem.item.stock > 0 && enlargedItem.item.availability === 'DISPONIBLE' ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart(enlargedItem.item);
                        setEnlargedItem(null);
                      }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-red-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </button>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-500 text-xs font-bold uppercase">
                      Agotado
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
