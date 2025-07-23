'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';

type Product = {
  id: number;
  name: string;
  price: string;
  availability: string;
  images: { src: string; alt: string; dataAiHint: string; option: string }[];
  options: { type: string; values: string[] };
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const newImage = product.images.find(
      (img) => img.option.toLowerCase() === option.toLowerCase()
    );
    if (newImage) {
      setActiveImage(newImage);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-secondary border-2 border-primary">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={activeImage.dataAiHint}
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col items-center text-center">
        <h3 className="font-normal text-base uppercase flex-grow text-white tracking-wider">
          {product.name}
        </h3>
        <p className="text-primary font-bold text-lg mt-1">{product.price}</p>
        <p className="text-green-500 text-sm mt-1">{product.availability}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-center">
        <div className="flex flex-wrap gap-2 mb-2 justify-center">
          {product.options.values.map((option) => (
            <Button
              key={option}
              variant={selectedOption === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOptionClick(option)}
              className="text-xs h-8 px-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {option}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground h-4">
          {selectedOption
            ? `${
                product.options.type.charAt(0).toUpperCase() +
                product.options.type.slice(1)
              } seleccionado`
            : `Selecciona un ${product.options.type}`}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
