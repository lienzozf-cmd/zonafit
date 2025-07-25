'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Product, ProductOption } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState(`Selecciona un ${product.options.type}`);
  const [currentImage, setCurrentImage] = useState(product.images[0].src);

  const handleOptionClick = (option: ProductOption) => {
    setSelectedOption(option);
    setAvailabilityMessage(`Disponible: ${option.stock} unidades`);

    const newImage = product.images.find(img => img.option === option.value);
    if (newImage) {
      setCurrentImage(newImage.src);
    }
  };
  
  return (
    <div 
        className="product-item"
        id={`product-item-${product.id}`}
    >
        <div className="product-carousel">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
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
                className={selectedOption?.value === option.value ? 'active' : ''}
                >
                {option.value}
                </button>
            ))}
            </div>
            <p className="availability-message">
                {availabilityMessage}
            </p>
            <button className="add-to-cart-button">AGREGAR</button>
        </div>
    </div>
  );
};

export default ProductCard;
