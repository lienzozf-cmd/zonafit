'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { Dumbbell } from 'lucide-react';

const banners = [
  { src: '/assets/images/banners/banner2.webp', alt: 'Banner 2' },
  { src: '/assets/images/banners/banner1.webp', alt: 'Banner 1' },
  { src: '/assets/images/banners/banner3.webp', alt: 'Banner 3' },
  { src: '/assets/images/banners/banner4.webp', alt: 'Banner 4' },
  { src: '/assets/images/banners/banner5.jpg', alt: 'Banner 5' },
  { src: '/assets/images/banners/banner6.png', alt: 'Banner 6' },
];

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="hero-banner max-w-[94%] mx-auto mt-4 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] md:h-[85vh] w-full">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  className="object-contain"
                  data-ai-hint="fitness store"
                  quality={100}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-30">
        <Link href="/marcas" passHref>
          <button className="relative group px-4 py-2 md:px-8 md:py-3 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95 border border-white/20 group-hover:border-red-600 bg-black/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="relative z-10 text-white group-hover:text-red-600 font-normal text-xs md:text-sm uppercase tracking-[0.3em] flex items-center gap-2 transition-colors duration-500">
              Ver Todo
              <Dumbbell className="w-3 h-3 md:w-4 md:h-4 text-white/50 group-hover:text-red-600 transition-colors duration-500" />
            </span>
          </button>
        </Link>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`dot ${index === current ? 'is-selected' : ''}`}
          />
        ))}
      </div>
      
      {/* Fine red line at the bottom of the banner */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] z-20" />
    </section>
  );
};

export default HeroSection;
