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
    // Set initial selected option if only one exists and is not 'Único'
    if (product.options.values.length === 1 && product.options.values[0].value !== 'Único') {
      setSelectedOption(product.options.values[0]);
    } else if (product.options.values.length === 1 && product.options.values[0].value === 'Único') {
        setSelectedOption(product.options.values[0]);
    }
  }, [product.options.values]);

  useEffect(() => {
    if (selectedOption) {
      const updatedProduct = products.find(p => p.id === product.id);
      const updatedOption = updatedProduct?.options.values.find(v => v.value === selectedOption.value);
      if (updatedOption) {
        if(updatedOption.stock > 0) {
            setAvailabilityMessage(`Disponible: ${updatedOption.stock} unidades`);
        } else {
            setAvailabilityMessage('Agotado');
        }
      }
    } else if (!(product.options.values.length === 1 && product.options.values[0].value === 'Único')) {
      setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    } else {
        setAvailabilityMessage('');
    }
  }, [selectedOption, products, product.id, product.options.type, product.options.values]);


  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation(); // Prevent link navigation
    setSelectedOption(option);
    
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
  
  const isSelectedOptionAvailable = selectedOption ? selectedOption.stock > 0 : product.options.values.some(o => o.stock > 0);
  const showOptions = !(product.options.values.length === 1 && product.options.values[0].value === 'Único');

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
            <div className="flex justify-center my-2">
                 <div className={`product-availability ${isSelectedOptionAvailable ? 'available' : 'unavailable'}`}>
                    {isSelectedOptionAvailable ? 'Disponible' : 'Agotado'}
                 </div>
            </div>
            <div className="product-info mt-auto">
                {showOptions && (
                    <div className="size-options">
                    {product.options.values.map((option) => (
                        <button
                        key={option.value}
                        onClick={(e) => handleOptionClick(e, option)}
                        className={selectedOption?.value === option.value ? 'active' : ''}
                        >
                        {option.value}
                        </button>
                    ))}
                    </div>
                )}
                <p className="availability-message">
                    {availabilityMessage}
                </p>
                <button 
                    className="add-to-cart-button" 
                    onClick={handleAddToCart} 
                    disabled={!selectedOption || selectedOption.stock <= 0}
                >
                  {selectedOption?.stock === 0 ? 'Agotado' : 'AGREGAR'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
