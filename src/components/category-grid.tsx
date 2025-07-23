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
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/3 text-center md:text-left">
          <h2 className="text-4xl font-bold font-headline mb-4">ZONA FIT GT</h2>
          <p className="text-lg text-muted-foreground">
          "Desata tu mejor versión con fuerza, estilo y elegancia. Adentrate a ZONA FIT GT y se tu mejor versión: donde tu energía se viste, se nutre y se luce."
          </p>
        </div>
        <div className="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] md:h-[600px]">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className={cn(
                'relative rounded-lg overflow-hidden group',
                category.className
              )}
            >
              <Image
                src={category.image.src}
                alt={category.image.alt}
                data-ai-hint={category.image.dataAiHint}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold font-headline">{category.name}</h3>
                <p className="text-sm opacity-80">{category.products} productos</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
