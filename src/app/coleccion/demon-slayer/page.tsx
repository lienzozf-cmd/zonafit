'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, Eye, X, Volume2, VolumeX, Flame, ShieldCheck } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCartStore } from '@/stores/cart-store';
import { type Product, type ProductColor, type ProductOption, products as initialProducts } from '@/lib/data';

interface CharacterMeta {
  character: string;
  tag: string;
  description: string;
}

const DEMON_SLAYER_META: Record<number, CharacterMeta> = {
  2667: {
    character: 'Tanjiro Kamado',
    tag: 'Respiración de Agua',
    description: 'Prenda oficial de alto rendimiento Darc Sport x Demon Slayer. Gráfico exclusivo de Tanjiro Kamado con tecnología de secado rápido y algodón ultra resistente.'
  },
  2668: {
    character: 'Nezuko Kamado',
    tag: 'Fuego Demoníaco',
    description: 'Edición limitada Nezuko Kamado en corte atlético que realza la figura. Impresión de alta fidelidad y máxima transpirabilidad.'
  },
  2666: {
    character: 'Inosuke Hashibira',
    tag: 'Respiración de la Bestia',
    description: 'Tributo salvaje a Inosuke Hashibira. Confección en 100% algodón pesado de primera calidad con ajuste relajado.'
  },
  2669: {
    character: 'Zenitsu Agatsuma',
    tag: 'Respiración del Rayo',
    description: 'Diseño electrizante de Zenitsu Agatsuma: Respiración del Rayo Primera Postura. Gráficos de colección de alto impacto visual.'
  },
  2672: {
    character: 'Tengen Uzui',
    tag: 'Pilar del Sonido',
    description: 'El Pilar del Sonido Tengen Uzui en colaboración especial Wolves. Corte oversized extravagante con diseño de lujo en tinta brillante.'
  },
  9106: {
    character: 'Swordsmen Duo',
    tag: 'Tanjiro & Tomioka',
    description: 'Playera oficial YoungLA Anime Collection con estampado de alta densidad Swordsmen Duo en suave algodón premium heavyweight.'
  },
  9107: {
    character: 'Kyojuro Rengoku',
    tag: 'Pilar de la Llama',
    description: 'Playera gráfica doble edición especial YoungLA: Set Your Heart Ablaze & Hinokami Kagura en tributo a la serie.'
  },
  3054: {
    character: 'Nezuko Special Zip-Up',
    tag: 'Edición Limitada',
    description: 'Chaqueta de cremallera Demon Slayer oficial YoungLA. Forro polar ultra suave, bordados exclusivos y detalles premium inspirados en Nezuko.'
  }
};

const DEMON_SLAYER_PRODUCT_IDS = [2667, 2668, 2666, 2669, 2672, 9106, 9107, 3054];

// Sub-component for an individual product card with full size selection and store-synced cart adding
function DemonSlayerProductCard({
  product,
  onEnlarge
}: {
  product: Product;
  onEnlarge: (imgSrc: string, name: string, brand: string, character: string, price: string) => void;
}) {
  const getProductOption = useCartStore((state) => state.getProductOption);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const meta = DEMON_SLAYER_META[product.id] || {
    character: 'Demon Slayer',
    tag: 'Kimetsu no Yaiba',
    description: product.description
  };

  // Initialize selected color (if product has colors)
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(() => {
    if (product.colors && product.colors.length > 0) {
      // Pick first color that has stock, or first color
      const inStockColor = product.colors.find(c => {
        const opts = c.options?.values || [];
        return opts.some(o => (getProductOption(product.id, o.value, c.name)?.stock ?? o.stock ?? 0) > 0);
      });
      return inStockColor || product.colors[0];
    }
    return undefined;
  });

  // Available size options based on selected color or product options
  const availableOptions = useMemo(() => {
    return selectedColor?.options?.values || product.options?.values || [];
  }, [selectedColor, product]);

  // Initialize selected size option
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(() => {
    const opts = selectedColor?.options?.values || product.options?.values || [];
    const inStockOpt = opts.find(o => (getProductOption(product.id, o.value, selectedColor?.name)?.stock ?? o.stock ?? 0) > 0);
    return inStockOpt || opts[0];
  });

  // When selectedColor changes, update selectedOption to an available size in that color
  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    const opts = color.options?.values || [];
    const inStockOpt = opts.find(o => (getProductOption(product.id, o.value, color.name)?.stock ?? o.stock ?? 0) > 0);
    setSelectedOption(inStockOpt || opts[0]);
  };

  // Current image for this color or option
  const currentImage = useMemo(() => {
    if (selectedColor?.imageSrc) return selectedColor.imageSrc;
    if (product.images && product.images.length > 0) {
      if (selectedColor) {
        const matchingImg = product.images.find(img => img.color === selectedColor.name);
        if (matchingImg) return matchingImg.src;
      }
      return product.images[0].src;
    }
    return '/placeholder.png';
  }, [selectedColor, product]);

  // Current stock for the chosen size and color
  const currentStock = useMemo(() => {
    if (!selectedOption) return 0;
    return getProductOption(product.id, selectedOption.value, selectedColor?.name)?.stock ?? selectedOption.stock ?? 0;
  }, [product.id, selectedOption, selectedColor, getProductOption]);

  const [isAdded, setIsAdded] = useState(false);

  // Add to cart with identical ID and properties as product-card.tsx
  const handleAddToCart = () => {
    if (currentStock <= 0 || !selectedOption) return;

    const priceAsNumber = parseFloat((product.price || '0').replace('Q.', ''));
    const optionValue = selectedOption.value;
    const cartItemId = selectedColor 
      ? `${product.id}-${selectedColor.name}-${optionValue}` 
      : `${product.id}-default-${optionValue}`;
    const cartItemName = selectedColor 
      ? `${product.name} - ${selectedColor.name}` 
      : product.name;

    addItem({
      id: cartItemId,
      productId: product.id,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: optionValue,
      color: selectedColor?.name,
      quantity: 1
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setIsCartOpen(true);
  };

  const isProductSoldOut = product.availability === 'Agotado' || availableOptions.every(o => {
    return (getProductOption(product.id, o.value, selectedColor?.name)?.stock ?? o.stock ?? 0) === 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl border-2 border-emerald-950/70 hover:border-emerald-500 bg-[#070b09] p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] group"
      style={{
        backgroundImage: `linear-gradient(45deg, #040806 25%, transparent 25%, transparent 75%, #040806 75%, #040806), linear-gradient(-45deg, #040806 25%, transparent 25%, transparent 75%, #040806 75%, #040806)`,
        backgroundSize: '20px 20px'
      }}
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/60 mb-3 flex items-center justify-center p-2">
        <div
          onClick={() => onEnlarge(currentImage, product.name, product.brand, meta.character, product.price)}
          className="relative w-full h-full cursor-zoom-in"
          title="Toca para ampliar en alta resolución"
        >
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badges on Image */}
        {selectedOption && (
          <div className="absolute top-2.5 right-2.5 bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow z-10 font-mono">
            TALLA {selectedOption.value}
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 bg-red-950/90 border border-red-500/50 text-red-200 text-[9px] font-bold px-2 py-0.5 rounded-md shadow z-10 uppercase">
          {meta.character}
        </div>

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => onEnlarge(currentImage, product.name, product.brand, meta.character, product.price)}
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-white hover:border-emerald-500 transition-colors shadow z-10 cursor-pointer"
          title="Ampliar foto"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Style / Color Pill Buttons (e.g. for product 9107: Set Your Heart Ablaze vs Hinokami Kagura) */}
      {product.colors && product.colors.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2.5">
          {product.colors.map((color) => {
            const isSelected = selectedColor?.name === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {color.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Product Details */}
      <div className="flex flex-col items-center text-center flex-grow">
        <p className="text-emerald-400 font-extrabold uppercase tracking-wider text-xs mb-1">
          {product.brand}
        </p>

        <h3 className="text-white font-bold uppercase tracking-tight text-sm line-clamp-2 min-h-[38px] flex items-center justify-center">
          {product.name}
        </h3>

        <p className="text-red-500 font-black text-lg my-1 tracking-tight">
          {product.price}
        </p>

        {/* SIZE SELECTOR BUTTONS (BOTONES DE TALLAS) */}
        {availableOptions.length > 0 && (
          <div className="my-2.5 flex flex-col items-center gap-1.5 w-full bg-black/40 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Talla disponible:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {availableOptions.map((opt) => {
                const optStock = getProductOption(product.id, opt.value, selectedColor?.name)?.stock ?? opt.stock ?? 0;
                const isSoldOut = optStock <= 0;
                const isSelected = selectedOption?.value === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => setSelectedOption(opt)}
                    className={`min-w-[38px] h-8 px-2.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                      isSelected && !isSoldOut
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.6)] scale-105'
                        : isSoldOut
                        ? 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed line-through'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-white'
                    }`}
                  >
                    <span>{opt.value}</span>
                    {isSoldOut && <span className="text-[9px] text-red-500 font-mono no-underline">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Availability Badge & Units Message */}
        <div className="my-1">
          {isProductSoldOut || currentStock <= 0 ? (
            <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-bold uppercase px-3 py-1 rounded inline-block tracking-wider">
              AGOTADO
            </span>
          ) : currentStock === 1 ? (
            <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded inline-block tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              DISPONIBLE ({currentStock})
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded inline-block tracking-wider">
              DISPONIBLE ({currentStock})
            </span>
          )}
        </div>

        <p className="text-[11px] font-mono mt-1 mb-2 text-zinc-400">
          {currentStock === 1 ? (
            <span className="text-amber-400 font-bold">🔥 ¡Última unidad en Talla {selectedOption?.value}!</span>
          ) : currentStock > 1 ? (
            <span>Disponible: {currentStock} unidades en Talla {selectedOption?.value}</span>
          ) : (
            <span className="text-zinc-500">Agotado {selectedOption ? `en Talla ${selectedOption.value}` : ''}</span>
          )}
        </p>

        <p className="text-zinc-400 text-[11px] line-clamp-2 px-1 mb-3">
          {meta.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-2 w-full flex flex-col gap-2">
        {!isProductSoldOut && currentStock > 0 && selectedOption ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 via-red-600 to-emerald-600 hover:from-emerald-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAdded ? (
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
          href={`/product/${product.id}`}
          className="w-full py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold text-[11px] uppercase tracking-wider text-center transition-colors"
        >
          Ver detalles del producto
        </Link>
      </div>
    </motion.div>
  );
}

export default function DemonSlayerColeccionPage() {
  const storeProducts = useCartStore((state) => state.products);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const [activeBrandFilter, setActiveBrandFilter] = useState<'ALL' | 'DARC SPORT' | 'YOUNGLA'>('ALL');
  const [enlargedData, setEnlargedData] = useState<{
    imgSrc: string;
    name: string;
    brand: string;
    character: string;
    price: string;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Audio track Demon Slayer Opening
  useEffect(() => {
    const audio = new Audio('/Demon Slayer - Opening .mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

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

  // Resolve the 8 products using live store products with fallback to initialProducts
  const demonSlayerProducts = useMemo(() => {
    const sourceList = (storeProducts && storeProducts.length > 0) ? storeProducts : (initialProducts || []);
    return DEMON_SLAYER_PRODUCT_IDS.map(id => sourceList.find(p => p.id === id)).filter((p): p is Product => Boolean(p));
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    return demonSlayerProducts.filter(p => {
      if (activeBrandFilter === 'ALL') return true;
      if (activeBrandFilter === 'DARC SPORT') return p.brand?.toLowerCase().includes('darc');
      if (activeBrandFilter === 'YOUNGLA') return p.brand?.toLowerCase().includes('youngla');
      return true;
    });
  }, [demonSlayerProducts, activeBrandFilter]);

  const handleEnlarge = (imgSrc: string, name: string, brand: string, character: string, price: string) => {
    setEnlargedData({ imgSrc, name, brand, character, price });
  };

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
                Colección completa oficial de Kimetsu no Yaiba sincronizada con el inventario de la tienda. Confección de alto gramaje, impresiones de colección y cortes deportivos inspirados en los pilares y cazadores más emblemáticos.
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
            Mostrando {filteredProducts.length} prendas
          </span>
        </div>

        {/* 8 PRODUCTS GRID WITH LIVE STORE SYNC & SIZE BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredProducts.map((product) => (
            <DemonSlayerProductCard
              key={product.id}
              product={product}
              onEnlarge={handleEnlarge}
            />
          ))}
        </div>
      </main>

      {/* FULL-RESOLUTION ENLARGED MODAL */}
      <AnimatePresence>
        {enlargedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedData(null)}
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
                onClick={() => setEnlargedData(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                {enlargedData.brand} · {enlargedData.character}
              </span>

              <h3 className="text-white font-black text-sm sm:text-base text-center uppercase tracking-tight mb-3">
                {enlargedData.name}
              </h3>

              <div className="relative w-full aspect-square max-h-[400px] bg-black/60 rounded-xl overflow-hidden mb-4">
                <Image
                  src={enlargedData.imgSrc}
                  alt={enlargedData.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="w-full flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-xs block">Precio oficial:</span>
                  <span className="text-red-500 font-black text-lg">{enlargedData.price}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setEnlargedData(null)}
                  className="px-5 py-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase transition-colors"
                >
                  Cerrar vista
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
