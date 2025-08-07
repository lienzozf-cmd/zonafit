'use client';

import Image from 'next/image';
import { useProductStore } from '@/stores/product-store';

const CategoryGrid = () => {
  const { products } = useProductStore();

  const getProductCount = (category: 'mujer' | 'hombre' | 'accesorio' | 'suplemento' | 'joyeria') => {
    if (category === 'mujer' || category === 'hombre') {
      return products.filter(p => p.gender === category).length;
    }
    return products.filter(p => p.category === category).length;
  };

  const categoryData = [
    {
      name: 'Mujer',
      count: getProductCount('mujer'),
      image: '/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg',
      dataAiHint: 'woman fitness',
      className: 'mujer',
    },
    {
      name: 'Hombre',
      count: getProductCount('hombre'),
      image: '/assets/images/marcas/youngla/hombre/jerdaniv.jpg',
      dataAiHint: 'man fitness',
      className: 'hombre',
    },
    {
      name: 'Accesorios',
      count: getProductCount('accesorio'),
      image: '/assets/images/marcas/youngla/hombre/maletagym.png',
      dataAiHint: 'gym accessories',
      className: 'accesorios',
    },
    {
      name: 'Suplementos',
      count: getProductCount('suplemento'),
      image: '/assets/images/marcas/raw/prewcb.jpg',
      dataAiHint: 'supplements',
      className: 'suplementos',
    },
    {
      name: 'Joyería',
      count: getProductCount('joyeria'),
      image: '/assets/images/marcas/rgmnt/tridente.png',
      dataAiHint: 'jewelry',
      className: 'joyeria',
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
            <div className={`grid-item ${categoryData[0].className}`}>
              <Image src={categoryData[0].image} alt={categoryData[0].name} width={600} height={600} data-ai-hint={categoryData[0].dataAiHint} className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>{categoryData[0].name}</h3>
                <p>{categoryData[0].count} productos</p>
              </div>
            </div>
            <div className={`grid-item ${categoryData[1].className}`}>
              <Image src={categoryData[1].image} alt={categoryData[1].name} width={600} height={600} data-ai-hint={categoryData[1].dataAiHint} className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>{categoryData[1].name}</h3>
                <p>{categoryData[1].count} productos</p>
              </div>
            </div>
        </div>
        <div className="grid-row">
            <div className={`grid-item ${categoryData[2].className}`}>
              <Image src={categoryData[2].image} alt={categoryData[2].name} width={400} height={400} data-ai-hint={categoryData[2].dataAiHint} className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>{categoryData[2].name}</h3>
                <p>{categoryData[2].count} productos</p>
              </div>
            </div>
            <div className={`grid-item ${categoryData[3].className}`}>
              <Image src={categoryData[3].image} alt={categoryData[3].name} width={400} height={400} data-ai-hint={categoryData[3].dataAiHint} className="object-cover w-full h-full" />
              <div className="overlay-text">
                <h3>{categoryData[3].name}</h3>
                <p>{categoryData[3].count} productos</p>
              </div>
            </div>
            <div className={`grid-item ${categoryData[4].className}`}>
                <Image src={categoryData[4].image} alt={categoryData[4].name} width={400} height={400} data-ai-hint={categoryData[4].dataAiHint} className="object-cover w-full h-full" />
                <div className="overlay-text">
                    <h3>{categoryData[4].name}</h3>
                    <p>{categoryData[4].count} productos</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
