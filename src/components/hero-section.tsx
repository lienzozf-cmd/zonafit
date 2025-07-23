'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
    <section className="relative w-full h-screen overflow-hidden">
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black/30">
        <Button size="lg" className="mt-8 bg-black hover:bg-red-600 text-red-500 hover:text-white font-bold text-lg py-6 px-10 transition-all duration-300 ease-in-out hover:scale-105 border-2 border-red-500">
          COMPRAR AHORA
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
