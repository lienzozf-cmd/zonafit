'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from './ui/button';
import Autoplay from "embla-carousel-autoplay"

const heroImages = [
  { src: 'https://placehold.co/1600x800.png', alt: 'Man lifting weights', dataAiHint: 'gym workout' },
  { src: 'https://placehold.co/1600x800.png', alt: 'Woman in athletic wear', dataAiHint: 'fitness woman' },
  { src: 'https://placehold.co/1600x800.png', alt: 'Fitness supplements and gear', dataAiHint: 'fitness supplements' },
  { src: 'https://placehold.co/1600x800.png', alt: 'Man running on a treadmill', dataAiHint: 'man running' },
];

const HeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <Carousel 
        className="w-full h-full"
        plugins={[Autoplay({delay: 5000})]}
        opts={{loop: true}}
        >
        <CarouselContent className="h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={image.dataAiHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
      </Carousel>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline drop-shadow-lg animate-fade-in-down">
          Desata tu mejor versión
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200 drop-shadow-md animate-fade-in-up">
          Fuerza, estilo y elegancia. Adéntrate a ZONA FIT GT.
        </p>
        <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 px-10 transition-transform duration-300 ease-in-out hover:scale-105">
          COMPRAR AHORA
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
