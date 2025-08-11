
'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

const banners = [
  { src: '/assets/images/banners/banner1.png', alt: 'Banner 1' },
  { src: '/assets/images/banners/banner2.png', alt: 'Banner 2' },
  { src: '/assets/images/banners/banner3.png', alt: 'Banner 3' },
  { src: '/assets/images/banners/banner4.png', alt: 'Banner 4' },
  { src: '/assets/images/banners/banner5.png', alt: 'Banner 5' },
  { src: '/assets/images/banners/banner6.png', alt: 'Banner 6' },
];

const HeroSection = () => {
  return (
    <section className="hero-banner">
      <Carousel
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
          <div className="glowing-button-container">
            <button className="buy-now-button">
              Comprar Ahora
            </button>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
