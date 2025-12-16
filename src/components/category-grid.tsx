
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
      image: '/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg',
      dataAiHint: 'woman fitness',
      className: 'mujer',
      href: '/mujeres',
    },
    {
      name: 'Hombre',
      count: 'Ver',
      image: '/assets/images/marcas/youngla/hombre/jerdaniv.jpg',
      dataAiHint: 'man fitness',
      className: 'hombre',
      href: '/hombres',
    },
    {
      name: 'Accesorios',
      count: 'Ver',
      image: '/assets/images/marcas/youngla/hombre/maletagym.png',
      dataAiHint: 'gym accessories',
      className: 'accesorios',
      href: '/accesorios',
    },
    {
      name: 'Suplementos',
      count: 'Ver',
      image: '/assets/images/marcas/raw/prewcb.jpg',
      dataAiHint: 'supplements',
      className: 'suplementos',
      href: '/suplementos',
    },
    {
      name: 'Joyería',
      count: 'Ver',
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
