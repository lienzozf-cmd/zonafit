'use client';
import { useState } from 'react';
import Image from 'next/image';
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
    <div className="product-item bg-[#1a1a1a] rounded-lg border-2 border-accent text-white p-4 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
            <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover"
            data-ai-hint={activeImage.dataAiHint}
            />
        </div>
        <br />
        <h3 className="product-name text-sm uppercase font-normal tracking-wider text-left pl-2">{product.name}</h3>
        <p className="product-price text-accent font-bold text-left pl-2">{product.price}</p>
        <p className="product-availability text-green-500 text-left pl-2">
            Disponible
        </p>
        <div className="product-info mt-auto pt-2">
            <div className="size-options flex gap-2 justify-start pl-2">
            {product.options.values.map((option) => (
                <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className={`px-3 py-1 rounded-md border border-accent text-accent bg-black transition-transform duration-200 hover:scale-110 ${selectedOption?.value === option.value ? 'bg-accent text-black' : ''}`}
                >
                {option.value}
                </button>
            ))}
            </div>
            <p className="availability-message text-left pl-2 mt-2">
                {`Selecciona un ${product.options.type}`}
            </p>
        </div>
    </div>
  );
};

export default ProductCard;
