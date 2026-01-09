
'use client';
import Image from 'next/image';
import Link from 'next/link';

const brands = [
  { src: '/assets/images/logos/vanquish.webp', alt: 'Vanquish', href: '/marcas/vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.webp', alt: 'Darc Sport', href: '/marcas/darc-sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.webp', alt: 'Dragon Pharma', href: '/marcas/dragon-pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymshark.webp', alt: 'Gymshark', href: '/marcas/gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.webp', alt: 'YoungLA', href: '/marcas/youngla', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.webp', alt: 'Raw', href: '/marcas/raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/bumenergy.webp', alt: 'Bum Energy', href: '/marcas/bum-energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.webp', alt: 'RGMNT', href: '/marcas/rgmnt', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/civilr.webp', alt: 'Civil Regime', href: '/marcas/civil-regime', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dfyne.webp', alt: 'Dfyne', href: '/marcas/dfyne', dataAiHint: 'logo fitness' },
];

const BrandsSection = () => {
  return (
    <div className="promo-banner bg-black py-8">
      <div className="promo-banner-content">
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="mx-8 flex-shrink-0">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsSection;
