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
  { src: '/assets/images/banners/banner.jpg', alt: 'Man lifting weights', dataAiHint: 'gym workout' },
  { src: '/assets/images/banners/banner2.png', alt: 'Woman in athletic wear', dataAiHint: 'fitness woman' },
  { src: '/assets/images/banners/banner3.png', alt: 'Fitness supplements and gear', dataAiHint: 'fitness supplements' },
  { src: '/assets/images/banners/banner4.png', alt: 'Man running on a treadmill', dataAiHint: 'man running' },
];

const HeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-screen overflow-hidden">
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
        <Button size="lg" className="mt-8 bg-black hover:bg-primary/90 text-primary font-bold text-lg py-6 px-10 transition-transform duration-300 ease-in-out hover:scale-105 border-2 border-primary">
          COMPRAR AHORA
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
