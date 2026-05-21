
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';

const CategoryGrid = () => {
  // Simplified for now to prevent build loops.
  // The counts can be re-implemented in a more performant way if needed.
  const categoryData = [
    {
      name: 'Mujer',
      count: 'Ver',
      image: '/assets/images/marcas/gymshark/mujer/anabel.jpg',
      dataAiHint: 'woman fitness',
      className: 'mujer',
      href: '/mujeres',
    },
    {
      name: 'Hombre',
      count: 'Ver',
      image: '/assets/images/marcas/youngla/hombre/brayanlop.jpg',
      dataAiHint: 'man fitness',
      className: 'hombre',
      href: '/hombres',
    },
    {
      name: 'Accesorios',
      count: 'Ver',
      image: '/assets/images/accesorios/maletaroja.webp',
      dataAiHint: 'gym accessories',
      className: 'accesorios',
      href: '/accesorios',
    },
    {
      name: 'Suplementos',
      count: 'Ver',
      image: '/assets/images/marcas/raw/prewcb.webp',
      dataAiHint: 'supplements',
      className: 'suplementos',
      href: '/suplementos',
    },
    {
      name: 'Joyería',
      count: 'Ver',
      image: '/assets/images/marcas/rgmnt/pulsera.webp',
      dataAiHint: 'jewelry',
      className: 'joyeria',
      href: '/joyeria',
    }
  ];

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/assets/images/diamond-bg.png")', backgroundSize: '100px' }} />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 sm:w-12 bg-red-600/40" />
          <span className="text-red-600 font-bold tracking-[0.4em] text-[10px] uppercase">Estilo de Vida Elite</span>
          <div className="h-px w-8 sm:w-12 bg-red-600/40" />
        </div>
        
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter italic">
          ZONA <span className="text-red-600 drop-shadow-[0_0_20px_rgba(229,0,0,0.5)]">FIT GT</span>
        </h2>
        
        <div className="relative inline-block">
          <span className="absolute -top-8 -left-6 text-7xl text-red-600/10 font-serif pointer-events-none italic">"</span>
          <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed italic relative z-10 max-w-2xl mx-auto">
            Desata tu mejor versión con fuerza, estilo y elegancia. Adéntrate a <span className="text-white font-bold not-italic">ZONA FIT GT</span> y sé tu mejor versión: donde tu energía se viste, se nutre y se luce.
          </p>
          <span className="absolute -bottom-12 -right-6 text-7xl text-red-600/10 font-serif pointer-events-none italic">"</span>
        </div>
      </div>

      <div className="px-4">
      <div className="image-grid">
        <div className="grid-row">
          {categoryData.slice(0, 2).map(category => (
            <div key={category.name} className={`grid-item ${category.className}`}>
              <Link href={category.href} className="w-full h-full block">
                <Image src={category.image} alt={category.name} width={600} height={600} data-ai-hint={category.dataAiHint} className="object-cover w-full h-full" />
                <div className="overlay-text">
                  <h3>{category.name}</h3>
                  <p>{category.count} productos</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="grid-row">
          {categoryData.slice(2).map(category => (
            <div key={category.name} className={`grid-item ${category.className}`}>
              <Link href={category.href} className="w-full h-full block">
                <Image src={category.image} alt={category.name} width={400} height={400} data-ai-hint={category.dataAiHint} className="object-cover w-full h-full" />
                <div className="overlay-text">
                  <h3>{category.name}</h3>
                  <p>{category.count} productos</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
