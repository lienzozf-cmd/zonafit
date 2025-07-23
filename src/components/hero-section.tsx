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
    <section className="hero-banner">
      <Carousel 
        className="carousel-container"
        plugins={[Autoplay({delay: 5000})]}
        opts={{loop: true}}
        >
        <CarouselContent>
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="carousel-image">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                data-ai-hint={image.dataAiHint}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="banner-content">
        <Button className="buy-now-button">
          COMPRAR AHORA
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
