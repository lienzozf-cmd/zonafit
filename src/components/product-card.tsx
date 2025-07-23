
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from './ui/button';
import type { Product, ProductOption } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleOptionClick = (option: ProductOption) => {
    setSelectedOption(option);
    const newImage = product.images.find(
      (img) => img.option.toLowerCase() === option.value.toLowerCase()
    );
    if (newImage) {
      setActiveImage(newImage);
    }
  };

  return (
    <div className="product-item">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={activeImage.dataAiHint}
            />
        </div>
        <br />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        <p className="product-availability">
            {selectedOption !== null 
                ? (selectedOption.stock > 0 ? `${selectedOption.stock} disponibles` : 'Agotado') 
                : product.availability
            }
        </p>
        <div className="product-info">
            <div className="size-options">
            {product.options.values.map((option) => (
                <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className={selectedOption?.value === option.value ? 'active' : ''}
                >
                {option.value}
                </button>
            ))}
            </div>
            <p className="availability-message">
                {selectedOption === null ? `Selecciona un ${product.options.type}` : `${product.options.type.charAt(0).toUpperCase() + product.options.type.slice(1)} seleccionado`}
            </p>
        </div>
    </div>
  );
};

export default ProductCard;
