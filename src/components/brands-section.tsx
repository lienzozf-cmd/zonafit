import Image from 'next/image';

const brands = [
  { src: 'https://placehold.co/100x100.png', alt: 'Vanquish', dataAiHint: 'vanquish logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'Darc Sport', dataAiHint: 'darc sport logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'Dragon Pharma', dataAiHint: 'dragon pharma logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'Gymshark', dataAiHint: 'gymshark logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'YoungLA', dataAiHint: 'youngla logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'Raw', dataAiHint: 'raw nutrition logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'C4 Energy', dataAiHint: 'c4 energy logo' },
  { src: 'https://placehold.co/100x100.png', alt: 'RGMNT', dataAiHint: 'rgmnt logo' },
];

const BrandsSection = () => {
  return (
    <section className="bg-secondary/50 py-8">
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
          {brands.map((brand, index) => (
            <div key={index} className="relative h-16 w-16 md:h-20 md:w-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image
                src={brand.src}
                alt={brand.alt}
                fill
                className="object-contain rounded-full"
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
