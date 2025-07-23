import Image from 'next/image';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg', alt: 'Vanquish', dataAiHint: 'vanquish logo' },
  { src: '/assets/images/logos/darc.jpeg', alt: 'Darc Sport', dataAiHint: 'darc sport logo' },
  { src: '/assets/images/logos/dragonp.png', alt: 'Dragon Pharma', dataAiHint: 'dragon pharma logo' },
  { src: '/assets/images/logos/gymshark.png', alt: 'Gymshark', dataAiHint: 'gymshark logo' },
  { src: '/assets/images/logos/youngla.png', alt: 'YoungLA', dataAiHint: 'youngla logo' },
  { src: '/assets/images/logos/raw.png', alt: 'Raw', dataAiHint: 'raw nutrition logo' },
  { src: '/assets/images/logos/c4.png', alt: 'C4 Energy', dataAiHint: 'c4 energy logo' },
  { src: '/assets/images/logos/rgmnt.jpeg', alt: 'RGMNT', dataAiHint: 'rgmnt logo' },
];

const BrandsSection = () => {
  return (
    <section className="bg-black py-8">
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
          {brands.map((brand, index) => (
            <div key={index} className="relative h-20 w-20 md:h-24 md:w-24">
              <Image
                src={brand.src}
                alt={brand.alt}
                fill
                className="object-contain rounded-full transition-transform duration-300 hover:scale-110"
                data-ai-hint={brand.dataAiHint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
