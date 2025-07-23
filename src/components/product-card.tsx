'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  const [selectedOption, setSelectedOption] = useState<string | null>(
    product.options.values[0]
  );
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const newImage = product.images.find(img => img.option.toLowerCase() === option.toLowerCase());
    if (newImage) {
        setActiveImage(newImage);
    } else {
        setActiveImage(product.images[0]);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <div className="aspect-square relative w-full overflow-hidden">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={activeImage.dataAiHint}
          />
        </div>
        <Badge className="absolute top-2 right-2" variant={product.availability === 'Disponible' ? 'default' : 'destructive'}>{product.availability}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-primary font-bold text-xl mt-1">{product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start">
        <div className="flex flex-wrap gap-2 mb-2">
          {product.options.values.map((option) => (
            <Button
              key={option}
              variant={selectedOption === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOptionClick(option)}
              className="text-xs h-7"
            >
              {option}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground h-4">
          {selectedOption
            ? `Opción seleccionada: ${selectedOption}`
            : `Selecciona un ${product.options.type}`}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
