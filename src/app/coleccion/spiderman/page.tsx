'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, ZoomIn, X, Volume2, VolumeX, Sparkles, ShieldCheck } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCartStore } from '@/stores/cart-store';
import { SPIDERMAN_PRODUCTS } from '@/lib/spiderman-products';

interface SpidermanItem {
  id: string;
  productId: number;
  name: string;
  shortName: string;
  brand: string;
  price: string;
  priceNum: number;
  imageFront: string;
  imageBack: string;
  availability: string;
  stock: number;
  option: string;
  description: string;
}

const ITEMS: SpidermanItem[] = [
  {
    id: 'spiderman-beast',
    productId: 9001,
    name: 'SPIDERMAN BEAST (CIVIL REGIME)',
    shortName: 'SPIDERMAN BEAST',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    imageFront: '/assets/images/marcas/civil regime/spidermanbeast.webp',
    imageBack: '/assets/images/marcas/civil regime/spidermanbeast2.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    option: 'M',
    description: 'Edición limitada de colección Marvel x Civil Regime. Gráfico de alta definición Spider-Man Beast en corte vintage oversize.'
  },
  {
    id: 'spider-punk',
    productId: 9002,
    name: 'SPIDER PUNK (CIVIL REGIME)',
    shortName: 'SPIDER PUNK',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    imageFront: '/assets/images/marcas/civil regime/spidermanpunk2.webp',
    imageBack: '/assets/images/marcas/civil regime/spidermanpunk.webp',
    availability: 'AGOTADO',
    stock: 0,
    option: 'M',
    description: 'Edición limitada Spider Punk. Estilo rebelde y gráfico icónico en algodón pesado vintage wash de alta gama.'
  },
  {
    id: 'miles-morales',
    productId: 9003,
    name: 'MILES MORALES (CIVIL REGIME)',
    shortName: 'MILES MORALES',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    imageFront: '/assets/images/marcas/civil regime/spidermanmiles.webp',
    imageBack: '/assets/images/marcas/civil regime/spidermanmiles2.webp',
    availability: 'AGOTADO',
    stock: 0,
    option: 'M',
    description: 'Edición exclusiva Miles Morales x Civil Regime. Confección premium con textura suave, corte oversize y gráficos vibrantes.'
  },
  {
    id: 'spiderman-peter-parker',
    productId: 9004,
    name: 'SPIDERMAN PETER PARKER (CIVIL REGIME)',
    shortName: 'SPIDERMAN PETER PARKER',
    brand: 'CIVIL REGIME',
    price: 'Q.665.00',
    priceNum: 665,
    imageFront: '/assets/images/marcas/civil regime/spidermanrayas2.webp',
    imageBack: '/assets/images/marcas/civil regime/spidermanrayas.webp',
    availability: 'DISPONIBLE',
    stock: 1,
    option: 'M',
    description: 'El clásico Spider-Man Peter Parker redefinido por Civil Regime. Diseño de rayas icónico y acabado retro vintage de alto nivel.'
  }
];

export default function SpidermanColeccionPage() {
  const [selectedViews, setSelectedViews] = useState<Record<string, 'front' | 'back'>>({
    'spiderman-beast': 'front',
    'spider-punk': 'front',
    'miles-morales': 'front',
    'spiderman-peter-parker': 'front'
  });
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [enlargedItem, setEnlargedItem] = useState<{ item: SpidermanItem; isBack: boolean } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const getProductOption = useCartStore((state) => state.getProductOption);

  const getItemStock = (item: SpidermanItem) => {
    const variant = getProductOption ? getProductOption(item.productId, item.option) : undefined;
    return variant?.stock !== undefined ? variant.stock : item.stock;
  };

  const isItemAvailable = (item: SpidermanItem) => {
    const currentStock = getItemStock(item);
    return currentStock > 0 && item.availability.toUpperCase() !== 'AGOTADO';
  };

  const sortedItems = [...ITEMS].sort((a, b) => {
    const aAvail = isItemAvailable(a);
    const bAvail = isItemAvailable(b);
    if (aAvail && !bAvail) return -1;
    if (!aAvail && bAvail) return 1;
    return 0;
  });

  // Initialize Post Malone Sunflower track
  useEffect(() => {
    const audioUrl = '/' + encodeURIComponent('Post Malone, Swae Lee - Sunflower (Spider-Man Into the Spider-Verse).mp3');
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.65;
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

  const handleAddToCart = (item: SpidermanItem) => {
    if (!isItemAvailable(item)) return;
    const cartItem = {
      id: `${item.productId}-${item.option}`,
      productId: item.productId,
      name: item.name,
      image: item.imageFront,
      price: item.priceNum,
      quantity: 1,
      option: item.option
    };
    addItem(cartItem);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setIsCartOpen(true);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      <Header />

      {/* Spider-Man Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:py-16 bg-gradient-to-b from-black via-[#1c0507] to-[#070709] border-b border-red-950/60">
        {/* Spiderweb Background SVG Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 400" fill="none" stroke="#dc2626" strokeWidth="1">
            <path d="M 0 0 Q 250 180 500 0 T 1000 0" strokeDasharray="6 4" />
            <path d="M 0 100 Q 250 280 500 100 T 1000 100" strokeDasharray="4 4" />
            <path d="M 0 200 Q 250 380 500 200 T 1000 200" strokeDasharray="6 4" />
            <path d="M 500 0 L 500 400 M 250 0 L 250 400 M 750 0 L 750 400" strokeOpacity="0.3" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link & Music controller */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-700/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-red-500" />
              <span>Volver a la tienda</span>
            </Link>

            {/* Sunflower Music Pill */}
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full bg-red-950/70 hover:bg-red-900/80 border border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
              title={isPlaying ? 'Pausar música' : 'Reproducir música'}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span className="hidden xs:inline">Sunflower · Post Malone</span>
                  <span className="xs:hidden">Música ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Música OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Hero Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="bg-[#e50914] px-3.5 py-1 rounded text-white font-black text-xs sm:text-sm tracking-widest shadow-[0_0_15px_rgba(229,9,20,0.8)]">
                MARVEL
              </span>
              <span className="text-zinc-400 text-xs sm:text-sm font-mono tracking-widest uppercase">
                × CIVIL REGIME
              </span>
            </div>

            <h1
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none"
              style={{ fontFamily: 'Impact, sans-serif' }}
            >
              SPIDER-MAN VAULT
            </h1>

            <p className="mt-3 text-xs xs:text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
              Colección cápsula oficial de edición limitada. Confeccionadas en 100% algodón pesado vintage wash, corte oversize y piezas únicas (1 unidad por diseño en talla M).
            </p>

            <div className="mt-4 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-red-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-red-500 animate-spin" />
              <span>4 Piezas Exclusivas Desbloqueadas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Grid - Full Width & Ergonomic for Mobile */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
          {sortedItems.map((item) => {
            const currentView = selectedViews[item.id] || 'front';
            const activeImage = currentView === 'front' ? item.imageFront : item.imageBack;
            const isAdded = !!addedItems[item.id];
            const isAvailable = isItemAvailable(item);
            const currentStock = getItemStock(item);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#101014] rounded-2xl border-2 border-red-950/70 hover:border-red-600/80 transition-all duration-300 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_30px_rgba(229,9,20,0.35)]"
              >
                {/* Product Card Top: Brand Badge & Enlarge Action */}
                <div className="p-3.5 pb-2 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/60">
                  <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-red-500 font-mono">
                    {item.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnlargedItem({ item, isBack: currentView === 'back' })}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700/60 transition-colors"
                    title="Ver en pantalla completa"
                  >
                    <ZoomIn className="w-3 h-3 text-red-400" />
                    <span>Zoom</span>
                  </button>
                </div>

                {/* Big Image Container with Front/Back View */}
                <div
                  className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#18181f] to-[#0c0c10] flex items-center justify-center p-3 cursor-pointer group"
                  onClick={() => setEnlargedItem({ item, isBack: currentView === 'back' })}
                >
                  <Image
                    src={activeImage}
                    alt={item.name}
                    fill
                    priority
                    unoptimized
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Indicator to tap for zoom */}
                  <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-zinc-300 opacity-90 group-hover:opacity-100 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3 text-red-400" />
                    <span>Toca para agrandar</span>
                  </div>
                </div>

                {/* View Switcher: Frente / Espalda */}
                <div className="p-3 pt-2 bg-zinc-950/70 border-t border-zinc-900/80">
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleToggleView(item.id, 'front')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        currentView === 'front'
                          ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.7)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleView(item.id, 'back')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        currentView === 'back'
                          ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.7)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Espalda
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-snug">
                      {item.shortName}
                    </h2>

                    {/* Price in vibrant red */}
                    <div className="flex items-baseline gap-2 my-2">
                      <span className="text-xl sm:text-2xl font-black text-[#e50914] tracking-tight">
                        {item.price}
                      </span>
                    </div>

                    {/* Badges: Disponibilidad + Talla */}
                    <div className="flex flex-wrap items-center gap-2 my-2">
                      {isAvailable ? (
                        <span className="bg-[#16a34a] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                          DISPONIBLE
                        </span>
                      ) : (
                        <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                          AGOTADO
                        </span>
                      )}
                      <span className="bg-red-950/80 border border-red-600/60 text-red-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wider">
                        Talla {item.option}
                      </span>
                      <span className="text-zinc-400 text-[10px]">
                        · {isAvailable ? `${currentStock} unidad` : '0 unidades'}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-col gap-2">
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-3 rounded-xl bg-[#e50914] hover:bg-[#c40811] text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.5)] active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isAdded ? (
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
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 rounded-xl bg-zinc-800/90 text-zinc-500 font-black text-xs sm:text-sm tracking-widest uppercase cursor-not-allowed border border-zinc-700/50 flex items-center justify-center gap-2"
                      >
                        AGOTADO
                      </button>
                    )}

                    <Link
                      href={`/product/${item.productId}`}
                      className="text-center text-[11px] text-zinc-400 hover:text-red-400 font-semibold uppercase tracking-wider py-1 transition-colors"
                    >
                      Ver todos los detalles →
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>

      {/* FULLSCREEN HIGH-RESOLUTION ENLARGE MODAL */}
      <AnimatePresence>
        {enlargedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
            onClick={() => setEnlargedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
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
                  <h3 className="text-white font-black text-xs sm:text-sm tracking-wider uppercase">
                    {enlargedItem.item.shortName} · {enlargedItem.isBack ? 'VISTA POSTERIOR' : 'VISTA FRONTAL'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEnlargedItem(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Switcher inside modal */}
              <div className="flex justify-center gap-2 p-2 bg-zinc-950/90 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEnlargedItem({ ...enlargedItem, isBack: false })}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    !enlargedItem.isBack
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Frente
                </button>
                <button
                  type="button"
                  onClick={() => setEnlargedItem({ ...enlargedItem, isBack: true })}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    enlargedItem.isBack
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Espalda
                </button>
              </div>

              {/* High-res Image preview */}
              <div className="relative flex-1 w-full min-h-[350px] sm:min-h-[500px] p-4 bg-gradient-to-b from-[#141419] to-black flex items-center justify-center">
                <Image
                  src={enlargedItem.isBack ? enlargedItem.item.imageBack : enlargedItem.item.imageFront}
                  alt={enlargedItem.item.name}
                  fill
                  priority
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[#e50914] font-black text-lg sm:text-xl">
                    {enlargedItem.item.price}
                  </span>
                  <span className="block text-[11px] text-zinc-400">
                    {enlargedItem.item.stock > 0 && enlargedItem.item.availability.toUpperCase() !== 'AGOTADO'
                      ? `Talla ${enlargedItem.item.option} · ${enlargedItem.item.stock} unidad disponible`
                      : `Talla ${enlargedItem.item.option} · Agotado`}
                  </span>
                </div>
                {enlargedItem.item.stock > 0 && enlargedItem.item.availability.toUpperCase() !== 'AGOTADO' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(enlargedItem.item);
                      setEnlargedItem(null);
                    }}
                    className="py-2.5 px-6 rounded-xl bg-[#e50914] hover:bg-[#c40811] text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>AGREGAR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-6 rounded-xl bg-zinc-800/90 text-zinc-500 font-black text-xs sm:text-sm tracking-widest uppercase cursor-not-allowed border border-zinc-700/50 flex items-center gap-2"
                  >
                    AGOTADO
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
