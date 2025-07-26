'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/stores/product-store';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product: initialProduct }: ProductCardProps) => {
  const { products, decreaseStock } = useProductStore();
  const product = products.find((p) => p.id === initialProduct.id) || initialProduct;

  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState(product.images[0].src);
  const { addItem } = useCart();
  const { toast } = useToast();

  const [availabilityMessage, setAvailabilityMessage] = useState(`Selecciona un ${product.options.type}`);

  useEffect(() => {
    if (selectedOption) {
      const updatedProduct = products.find(p => p.id === product.id);
      const updatedOption = updatedProduct?.options.values.find(v => v.value === selectedOption.value);
      if (updatedOption) {
        setAvailabilityMessage(`Disponible: ${updatedOption.stock} unidades`);
      }
    } else {
        setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }
  }, [selectedOption, products, product.id, product.options.type]);


  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation(); // Prevent link navigation
    setSelectedOption(option);
    setAvailabilityMessage(`Disponible: ${option.stock} unidades`);

    const newImage = product.images.find(img => img.option === option.value);
    if (newImage) {
      setCurrentImage(newImage.src);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent link navigation
    if (!selectedOption) {
      toast({
        title: 'Error',
        description: `Por favor, selecciona un ${product.options.type}.`,
        variant: 'destructive',
      });
      return;
    }

    if (selectedOption.stock <= 0) {
      toast({
        title: 'Error',
        description: `No hay stock disponible para ${product.name} (${selectedOption.value}).`,
        variant: 'destructive',
      });
      return;
    }
    
    const priceAsNumber = parseFloat(product.price.replace(/Q\.|\s/g, ''));

    addItem({
      id: `${product.id}-${selectedOption.value}`,
      name: product.name,
      price: priceAsNumber,
      image: currentImage,
      option: selectedOption.value,
      quantity: 1,
    });
    
    decreaseStock(product.id, selectedOption.value);

    toast({
      title: 'Agregado al carrito',
      description: `${product.name} (${selectedOption.value}) ha sido agregado a tu carrito.`,
    });
  };
  
  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
    >
        <Link href={`/product/${product.id}`} className="product-image-link w-full">
            <div className="product-carousel">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
            </div>
        </Link>
        <div className='flex flex-col flex-grow mt-4'>
            <Link href={`/product/${product.id}`}>
                <h3 className="product-name">{product.name}</h3>
            </Link>
            <p className="product-price">{product.price}</p>
            <p className="product-availability">
                {product.availability}
            </p>
            <div className="product-info mt-auto">
                <div className="size-options">
                {product.options.values.map((option) => (
                    <button
                    key={option.value}
                    onClick={(e) => handleOptionClick(e, option)}
                    className={selectedOption?.value === option.value ? 'active' : ''}
                    disabled={option.stock <= 0}
                    >
                    {option.value}
                    </button>
                ))}
                </div>
                <p className="availability-message">
                    {availabilityMessage}
                </p>
                <button className="add-to-cart-button" onClick={handleAddToCart} disabled={selectedOption?.stock === 0}>
                  {selectedOption?.stock === 0 ? 'Agotado' : 'AGREGAR'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;