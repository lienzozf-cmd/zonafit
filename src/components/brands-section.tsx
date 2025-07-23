import Image from 'next/image';

const brands = [
  { src: '/assets/images/logos/vanquish.jpeg', alt: 'Vanquish' },
  { src: '/assets/images/logos/darc.jpeg', alt: 'Darc Sport' },
  { src: '/assets/images/logos/dragonp.png', alt: 'Dragon Pharma' },
  { src: '/assets/images/logos/gymshark.png', alt: 'Gymshark' },
  { src: '/assets/images/logos/youngla.png', alt: 'YoungLA' },
  { src: '/assets/images/logos/raw.png', alt: 'Raw' },
  { src: '/assets/images/logos/c4.png', alt: 'C4 Energy' },
  { src: '/assets/images/logos/rgmnt.jpeg', alt: 'RGMNT' },
];

const BrandsSection = () => {
  return (
    <div className="circular-images-container">
      {brands.map((brand, index) => (
        <Image key={index} src={brand.src} alt={brand.alt} width={150} height={150} />
      ))}
    </div>
  );
};

export default BrandsSection;
