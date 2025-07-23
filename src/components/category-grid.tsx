import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Mujer',
    products: 47,
    href: '/mujer',
    image: {
      src: '/assets/images/marcas/gymshark/mujer/anabelrojo2.jpg',
      alt: 'Woman in fitness attire',
      dataAiHint: 'fitness woman',
    },
    className: 'large-vertical',
  },
  {
    name: 'Hombre',
    products: 24,
    href: '/hombre',
    image: {
      src: '/assets/images/marcas/youngla/hombre/jerdaniv.jpg',
      alt: 'Man working out',
      dataAiHint: 'fitness man',
    },
    className: 'large-horizontal',
  },
  {
    name: 'Accesorios',
    products: 24,
    href: '/accesorios',
    image: {
      src: '/assets/images/marcas/youngla/hombre/maletagym.png',
      alt: 'Gym bag',
      dataAiHint: 'gym accessories',
    },
    className: 'small-square',
  },
  {
    name: 'Suplementos',
    products: 24,
    href: '/suplementos',
    image: {
      src: '/assets/images/marcas/raw/prewcb.jpg',
      alt: 'Protein powder container',
      dataAiHint: 'protein supplement',
    },
    className: 'small-square',
  },
  {
    name: 'Joyería',
    products: 24,
    href: '/joyeria',
    image: {
      src: '/assets/images/marcas/rgmnt/tridente.png',
      alt: 'Fitness-themed jewelry',
      dataAiHint: 'fitness jewelry',
    },
    className: 'small-square',
  },
];

const CategoryGrid = () => {
  return (
    <section className="fitness-goals">
      <div className="goal-content">
        <h2>ZONA FIT GT</h2>
        <p>"Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce."</p>
      </div>
      <div className="image-grid">
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.name}
            className={cn(
              'grid-item',
              category.className
            )}
          >
            <Image
              src={category.image.src}
              alt={category.image.alt}
              data-ai-hint={category.image.dataAiHint}
              fill
              className="object-cover"
            />
            <div className="overlay-text">
              <h3>{category.name}</h3>
              <p>{category.products} productos</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
