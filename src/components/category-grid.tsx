import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
    className: 'md:row-span-2',
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
    className: 'md:col-span-2',
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
    className: '',
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
    className: '',
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
    className: 'md:col-span-2',
  },
];

const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-headline mb-4">ZONA FIT GT</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        "Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce."
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto h-auto md:h-[700px]">
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.name}
            className={cn(
              'relative rounded-lg overflow-hidden group shadow-lg',
              category.className
            )}
          >
            <Image
              src={category.image.src}
              alt={category.image.alt}
              data-ai-hint={category.image.dataAiHint}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute bottom-5 left-5 bg-black/50 text-white p-3 rounded-md">
              <h3 className="text-xl font-bold font-headline">{category.name}</h3>
              <p className="text-sm">{category.products} productos</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
