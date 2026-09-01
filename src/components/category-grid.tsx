'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface CategoryItem {
  name: string;
  count: string;
  subtitle: string;
  image: string;
  dataAiHint: string;
  href: string;
  tag: string;
}

const mainCategories: CategoryItem[] = [
  {
    name: 'Mujer',
    subtitle: 'Ropa deportiva, tops, leggings y conjuntos premium',
    count: 'Ver Colección',
    image: '/assets/images/marcas/gymshark/mujer/anabellucinda.jpg',
    dataAiHint: 'woman fitness',
    href: '/mujeres',
    tag: 'Femenino'
  },
  {
    name: 'Hombre',
    subtitle: 'Compresión, tanks, playeras oversize y shorts',
    count: 'Ver Colección',
    image: '/assets/images/marcas/gymshark/hombre/davidlaidonyx.jpg',
    dataAiHint: 'man fitness',
    href: '/hombres',
    tag: 'Masculino'
  }
];

const secondaryCategories: CategoryItem[] = [
  {
    name: 'Accesorios',
    subtitle: 'Straps, cinturones, pachones y mochilas',
    count: 'Explorar',
    image: '/assets/images/Accesorios/maletaroja.webp',
    dataAiHint: 'gym accessories',
    href: '/accesorios',
    tag: 'Equipamiento'
  },
  {
    name: 'Suplementos',
    subtitle: 'Proteínas, creatinas, pre-entrenos y vitaminas',
    count: 'Explorar',
    image: '/assets/images/marcas/raw/prewcb.webp',
    dataAiHint: 'supplements',
    href: '/suplementos',
    tag: 'Nutrición'
  },
  {
    name: 'Joyería',
    subtitle: 'Cadenas, dijes y pulseras en acero 316L',
    count: 'Explorar',
    image: '/assets/images/marcas/rgmnt/pulsera.webp',
    dataAiHint: 'jewelry',
    href: '/joyeria',
    tag: 'RGMNT'
  }
];

// Interactive 3D Card with Mouse-following Tilt + Glare + Dynamic Floating Shadow
const TiltCard = ({
  category,
  aspectClass = 'h-[500px] md:h-[580px]',
  tagColor = 'bg-red-600/90'
}: {
  category: CategoryItem;
  aspectClass?: string;
  tagColor?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt limits: -8deg to +8deg
    const rotX = -((y - centerY) / centerY) * 9;
    const rotY = ((x - centerX) / centerX) * 9;

    setRotateX(rotX);
    setRotateY(rotY);

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden cursor-pointer group`}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-red-600/60 transition-colors duration-500"
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 25px rgba(220, 38, 38, 0.35)`
            : '0 10px 30px -10px rgba(0,0,0,0.6)',
        }}
      >
        <Link href={category.href} className="block w-full h-full relative">
          {/* Main Image with Smooth Zoom */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={category.dataAiHint}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              quality={95}
            />
          </div>

          {/* Dynamic Interactive Light Glare overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 65%)`,
            }}
          />

          {/* Gradient Shadows for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 z-10 transition-opacity duration-300 group-hover:via-black/40" />

          {/* Top Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white ${tagColor} shadow-lg backdrop-blur-md border border-white/20`}>
              <Sparkles className="w-3 h-3" />
              {category.tag}
            </span>
          </div>

          {/* Floating Action Arrow */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-red-600 group-hover:border-red-500 group-hover:text-white transition-all duration-300 shadow-xl group-hover:scale-110">
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>

          {/* Bottom Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end transform transition-transform duration-300 group-hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-10" />
              <span className="text-red-500 font-extrabold text-xs tracking-widest uppercase">
                Zona Fit Gt
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-1 drop-shadow-md">
              {category.name}
            </h3>

            <p className="text-zinc-400 text-xs md:text-sm font-medium line-clamp-2 mb-4 group-hover:text-zinc-200 transition-colors duration-300">
              {category.subtitle}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/15">
              <span className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-red-400 transition-colors duration-300 flex items-center gap-1.5">
                {category.count}
                <span className="text-red-500 font-black">→</span>
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Original 100%
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

// Magnetic Sliding-Fill CTA Button
const MagneticZonafitButton = () => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.25;
    const y = (clientY - (top + height / 2)) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <Link
        ref={btnRef}
        href="/marcas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group overflow-hidden inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 rounded-full border-2 border-red-600 bg-black text-white font-black text-sm md:text-base uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(229,0,0,0.4)] hover:shadow-[0_0_50px_rgba(229,0,0,0.85)] transition-all duration-500 active:scale-95"
      >
        {/* Sliding Liquid Color Fill Effect from Left to Right */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none" />

        {/* Shimmer Light Bar */}
        <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out pointer-events-none" />

        {/* Pulsing Light Glow Icon */}
        <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 group-hover:bg-white text-white group-hover:text-red-600 transition-colors duration-300 shadow-md">
          <Zap className="w-4 h-4 fill-current animate-pulse" />
        </span>

        {/* Text */}
        <span className="relative z-10 text-white tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-black">
          ZONAFITGT
        </span>

        {/* Arrow Micro-interaction */}
        <span className="relative z-10 text-white/80 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300">
          <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
        </span>
      </Link>
    </motion.div>
  );
};

const CategoryGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const yOffset1 = useTransform(smoothProgress, [0, 1], [30, -30]);
  const yOffset2 = useTransform(smoothProgress, [0, 1], [-20, 20]);

  return (
    <section ref={containerRef} className="py-20 md:py-28 bg-black relative overflow-hidden text-white">
      {/* Dynamic Ambient Background Illumination to eliminate empty black void */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-950/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Estilo de Vida Elite</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase italic">
            ZONA <span className="text-red-600 drop-shadow-[0_0_30px_rgba(229,0,0,0.6)] not-italic">FIT GT</span>
          </h2>

          <div className="relative inline-block my-2 max-w-2xl mx-auto">
            <span className="absolute -top-6 -left-6 text-6xl text-red-600/20 font-serif pointer-events-none">“</span>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-medium leading-relaxed italic relative z-10">
              Desata tu mejor versión con fuerza, estilo y elegancia. Adéntrate a <span className="text-white font-black not-italic">ZONA FIT GT</span>: donde tu energía se viste, se nutre y se luce al máximo nivel.
            </p>
            <span className="absolute -bottom-8 -right-6 text-6xl text-red-600/20 font-serif pointer-events-none">”</span>
          </div>

          {/* Featured Primary CTA Button with Sliding Fill & Magnetic Cursor Follow */}
          <div className="mt-8">
            <MagneticZonafitButton />
          </div>
        </div>

        {/* Row 1: Mujer & Hombre (2 High-Impact Parallax Cards) */}
        <motion.div style={{ y: yOffset1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
          {mainCategories.map(cat => (
            <TiltCard
              key={cat.name}
              category={cat}
              aspectClass="h-[460px] sm:h-[520px] md:h-[600px]"
              tagColor="bg-red-600"
            />
          ))}
        </motion.div>

        {/* Row 2: Accesorios, Suplementos, Joyería (3 Balanced 3D Cards with Ambient Parallax) */}
        <motion.div style={{ y: yOffset2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {secondaryCategories.map((cat, idx) => (
            <TiltCard
              key={cat.name}
              category={cat}
              aspectClass="h-[380px] sm:h-[420px] md:h-[460px]"
              tagColor={idx === 1 ? 'bg-blue-600' : idx === 2 ? 'bg-amber-600' : 'bg-red-600'}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
