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
    <div className="product-item">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover"
            data-ai-hint={activeImage.dataAiHint}
            />
        </div>
        <br />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        <p className="product-availability">
            {product.availability}
        </p>
        <div className="product-info">
            <div className="size-options">
            {product.options.values.map((option) => (
                <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                >
                {option.value}
                </button>
            ))}
            </div>
            <p className="availability-message">
                {`Selecciona un ${product.options.type}`}
            </p>
        </div>
    </div>
  );
};

export default ProductCard;
