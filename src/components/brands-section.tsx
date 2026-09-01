
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
    <div className="promo-banner bg-black py-4 sm:py-6 md:py-8 border-y border-zinc-900/80 overflow-hidden">
      <div className="promo-banner-content items-center">
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="mx-2.5 sm:mx-4 md:mx-6 flex-shrink-0">
            <Link href={brand.href} passHref>
              <div className="relative w-[75px] h-[75px] sm:w-[95px] sm:h-[95px] md:w-[125px] md:h-[125px] transition-transform duration-300 hover:scale-110">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  fill
                  sizes="(max-width: 640px) 75px, (max-width: 768px) 95px, 125px"
                  data-ai-hint={brand.dataAiHint}
                  className="rounded-full inline-block border-2 border-red-600/60 hover:border-red-500 object-cover shadow-[0_0_15px_rgba(229,0,0,0.2)] hover:shadow-[0_0_20px_rgba(229,0,0,0.5)] transition-all bg-white"
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
