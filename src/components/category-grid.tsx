'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductStore } from '@/providers/product-provider';

const CategoryGrid = () => {
  const products = useProductStore((state) => state.products);
  const [counts, setCounts] = useState({
    mujer: 0,
    hombre: 0,
    accesorio: 0,
    suplemento: 0,
    joyeria: 0,
  });

  useEffect(() => {
    if (products && products.length > 0) {
      setCounts({
        mujer: products.filter(p => p.gender === 'mujer').length,
        hombre: products.filter(p => p.gender === 'hombre').length,
        accesorio: products.filter(p => p.category === 'accesorio').length,
        suplemento: products.filter(p => p.category === 'suplemento').length,
        joyeria: products.filter(p => p.category === 'joyeria').length,
      });
    }
  }, [products]);

  const categoryData = [
    {
      name: 'Mujer',
      count: counts.mujer,
      image: '/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg',
      dataAiHint: 'woman fitness',
      className: 'mujer',
      href: '/mujeres',
    },
    {
      name: 'Hombre',
      count: counts.hombre,
      image: '/assets/images/marcas/youngla/hombre/jerdaniv.jpg',
      dataAiHint: 'man fitness',
      className: 'hombre',
      href: '/hombres',
    },
    {
      name: 'Accesorios',
      count: counts.accesorio,
      image: '/assets/images/marcas/youngla/hombre/maletagym.png',
      dataAiHint: 'gym accessories',
      className: 'accesorios',
      href: '/accesorios',
    },
    {
      name: 'Suplementos',
      count: counts.suplemento,
      image: '/assets/images/marcas/raw/prewcb.jpg',
      dataAiHint: 'supplements',
      className: 'suplementos',
      href: '/suplementos',
    },
    {
      name: 'Joyería',
      count: counts.joyeria,
      image: '/assets/images/marcas/rgmnt/tridente.png',
      dataAiHint: 'jewelry',
      className: 'joyeria',
      href: '/joyeria',
    }
  ];

  return (
    <section className="fitness-goals">
      <div className="goal-content">
        <h2 className='animated-heading'>ZONA FIT GT</h2>
        <p>"Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce.".</p>
      </div>
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
    </section>
  );
};

export default CategoryGrid;
