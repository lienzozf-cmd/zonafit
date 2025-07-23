'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product, ProductOption } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState(`Selecciona un ${product.options.type}`);

  const handleOptionClick = (option: ProductOption) => {
    setSelectedOption(option);
    setAvailabilityMessage(`Disponible: ${option.stock} unidades`);
  };

  useEffect(() => {
    const item = document.getElementById(`product-item-${product.id}`);
    if(item) {
        item.style.opacity = '0';
        setTimeout(() => {
            if(item) item.style.opacity = '1';
        }, 100);
    }
  }, [product.id]);

  return (
    <div className="product-item" id={`product-item-${product.id}`}>
        <div className="product-carousel">
            <div className="carousel-images">
                <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                className="object-cover"
                />
            </div>
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
        </div>
    </div>
  );
};

export default ProductCard;
