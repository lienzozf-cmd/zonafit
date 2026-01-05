
'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg?v=2', alt: 'Vanquish', href: '/marcas/vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.png?v=3', alt: 'Darc Sport', href: '/marcas/darc-sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.png?v=2', alt: 'Dragon Pharma', href: '/marcas/dragon-pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymshark.png?v=9', alt: 'Gymshark', href: '/marcas/gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.png?v=3', alt: 'YoungLA', href: '/marcas/youngla', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.png?v=2', alt: 'Raw', href: '/marcas/raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/bumenergy.png?v=7', alt: 'Bum Energy', href: '/marcas/bum-energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.png?v=2', alt: 'RGMNT', href: '/marcas/rgmnt', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/civilr.png?v=7', alt: 'Civil Regime', href: '/marcas/civil-regime', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dfyne.png', alt: 'Dfyne', href: '/marcas/dfyne', dataAiHint: 'logo fitness' },
];

// Duplicate brands for seamless looping effect
const allBrands = [...brands, ...brands];

const BrandsSection = () => {
  return (
    <div className="promo-banner bg-black py-8">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {allBrands.map((brand, index) => (
            <CarouselItem key={index} className="basis-1/4 md:basis-1/6 lg:basis-1/8 pl-8">
              <Link href={brand.href} passHref>
                <div className="relative w-[150px] h-[150px]">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={150}
                    height={150}
                    data-ai-hint={brand.dataAiHint}
                    className="rounded-full inline-block border-2 border-accent object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BrandsSection;
