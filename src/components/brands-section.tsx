import Image from 'next/image';

const brands = [
  { src: 'https://placehold.co/150x150.png', alt: 'Vanquish', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'Darc Sport', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'Dragon Pharma', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'Gymshark', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'YoungLA', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'Raw', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'C4 Energy', dataAiHint: 'logo fitness' },
  { src: 'https://placehold.co/150x150.png', alt: 'RGMNT', dataAiHint: 'logo fitness' },
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
