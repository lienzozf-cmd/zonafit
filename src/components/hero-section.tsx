
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

const banners = [
  { src: '/assets/images/banners/banner8.webp', alt: 'Banner 8' },
  { src: '/assets/images/banners/banner2.webp', alt: 'Banner 2' },
  { src: '/assets/images/banners/banner3.webp', alt: 'Banner 3' },
  { src: '/assets/images/banners/banner4.webp', alt: 'Banner 4' },
  { src: '/assets/images/banners/banner5.webp', alt: 'Banner 5' },
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
    <section className="hero-banner">
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
              <div className="relative h-[100vh] w-full">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  data-ai-hint="fitness store"
                  quality={100}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="banner-content">
        <Link href="/marcas" passHref>
          <button className="blob-button">
            <div className="inner-text">Comprar Ahora</div>
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
    </section>
  );
};

export default HeroSection;
