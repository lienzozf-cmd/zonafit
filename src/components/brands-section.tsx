import Image from 'next/image';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg', alt: 'Vanquish', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/darc.jpeg', alt: 'Darc Sport', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/dragonp.png', alt: 'Dragon Pharma', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/gymshark.png', alt: 'Gymshark', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/youngla.png', alt: 'YoungLA', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/raw.png', alt: 'Raw', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/c4.png', alt: 'C4 Energy', dataAiHint: 'logo fitness' },
  { src: '/assets/images/logos/rgmnt.jpeg', alt: 'RGMNT', dataAiHint: 'logo fitness' },
];

const BrandsSection = () => {
  return (
    <div className="circular-images-container">
      {brands.map((brand, index) => (
        <Image
          key={index}
          src={brand.src}
          alt={brand.alt}
          width={150}
          height={150}
          data-ai-hint={brand.dataAiHint}
          className="rounded-full inline-block m-2"
        />
      ))}
    </div>
  );
};

export default BrandsSection;
