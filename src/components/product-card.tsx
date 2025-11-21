'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
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
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  useEffect(() => {
    // Set initial image and availability message
    if (product.options.values.length === 1 && product.options.values[0].value === 'Único') {
      const uniqueOption = product.options.values[0];
      setSelectedOption(uniqueOption);
      if (uniqueOption.stock > 0) {
        setAvailabilityMessage(`Disponible: ${uniqueOption.stock} unidades`);
      } else {
        setAvailabilityMessage('Agotado');
      }
    } else if (product.colors && product.colors.length > 0) {
      setAvailabilityMessage(`Selecciona un color y talla`);
    }
     else {
       setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }

    if (selectedColor) {
      setCurrentImage(selectedColor.imageSrc);
    } else if (product.images.length > 0) {
      setCurrentImage(product.images[0].src);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);


  useEffect(() => {
    // Update image based on selected option
    const imageForOption = product.images.find(img => img.option === selectedOption?.value);
    if (imageForOption) {
      setCurrentImage(imageForOption.src);
    }
    
    // Update availability message based on selected option
    if (selectedOption) {
        const productFromStore = products.find(p => p.id === product.id);
        let optionFromStore: ProductOption | undefined;
    
        if (selectedColor) {
            optionFromStore = productFromStore?.colors
                ?.find(c => c.name === selectedColor.name)
                ?.options.values.find(v => v.value === selectedOption.value);
        } else {
            optionFromStore = productFromStore?.options.values.find(v => v.value === selectedOption.value);
        }

        if (optionFromStore) {
            if(optionFromStore.stock > 0) {
                setAvailabilityMessage(`Disponible: ${optionFromStore.stock} unidades`);
            } else {
                setAvailabilityMessage('Agotado');
            }
        }
    } else if (product.colors?.length) {
        setAvailabilityMessage(`Selecciona una talla`);
    } else if (product.options.values.length > 1) {
        setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }
  }, [selectedOption, products, product, selectedColor]);


  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation(); // Prevent link navigation
    setSelectedOption(prev => (prev?.value === option.value ? null : option));
    const imageForOption = product.images.find(img => img.option === option.value && (selectedColor ? img.color === selectedColor.name : true));
    if (imageForOption) {
      setCurrentImage(imageForOption.src);
    }
  };

  const handleColorHover = (color: ProductColor) => {
    setCurrentImage(color.imageSrc);
    setSelectedColor(color);
    setSelectedOption(null); // Reset size selection when color changes
    setAvailabilityMessage(`Selecciona un ${color.options.type || product.options.type}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent link navigation
    if (product.colors && !selectedColor) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona un color.`,
            variant: 'destructive',
          });
          return;
    }
    
    if (!selectedOption) {
      toast({
        title: 'Error',
        description: `Por favor, selecciona un ${selectedColor?.options.type || product.options.type}.`,
        variant: 'destructive',
      });
      return;
    }

    if (selectedOption.stock <= 0) {
      toast({
        title: 'Error',
        description: `No hay stock disponible para esta selección.`,
        variant: 'destructive',
      });
      return;
    }
    
    const priceAsNumber = parseFloat(product.price.replace(/Q\.|\s/g, ''));
    const cartItemId = selectedColor ? `${product.id}-${selectedColor.name}-${selectedOption.value}` : `${product.id}-default-${selectedOption.value}`;
    const cartItemName = selectedColor ? `${product.name} - ${selectedColor.name}` : product.name;


    addItem({
      id: cartItemId,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: selectedOption.value,
      quantity: 1,
    });
    
    decreaseStock(product.id, selectedColor ? selectedColor.name : 'default', selectedOption.value);

    toast({
      title: 'Agregado al carrito',
      description: `${cartItemName} (${selectedOption.value}) ha sido agregado a tu carrito.`,
    });
  };
  
  const isAvailable = product.colors
    ? product.colors.some(c => c.options.values.some(v => v.stock > 0))
    : product.options.values.some(v => v.stock > 0);

  const showOptions = !(product.options.values.length === 1 && product.options.values[0].value === 'Único') || (product.colors && product.colors.length > 0);
  const optionsToShow = selectedColor?.options.values || product.options.values;

  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
        onMouseLeave={() => {
            if (product.colors && product.colors.length > 0 && selectedColor) {
                // When mouse leaves, reset to the selected color's image
                // No need to reset selectedColor itself, so hover works again
                setCurrentImage(selectedColor.imageSrc);
            } else {
                // Or to the first image if no colors
                setCurrentImage(product.images[0].src);
            }
        }}
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
                 <div className={`product-availability ${isAvailable ? 'available' : 'unavailable'}`}>
                    {isAvailable ? 'Disponible' : 'Agotado'}
                 </div>
            </div>

            {product.colors && product.colors.length > 1 && (
                <div className="color-swatches">
                    {product.colors.map((color) => (
                    <div
                        key={color.name}
                        className="color-swatch"
                        style={{ backgroundColor: color.hex }}
                        onMouseEnter={() => handleColorHover(color)}
                    ></div>
                    ))}
                </div>
            )}

            <div className="product-info mt-auto">
                {showOptions && (
                    <div className="size-options">
                    {optionsToShow.map((option) => (
                        (option.value !== 'Único') &&
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
                )}
                <p className="availability-message">
                    {availabilityMessage}
                </p>
                <button 
                    className="add-to-cart-button" 
                    onClick={handleAddToCart} 
                    disabled={!selectedOption || (selectedOption && selectedOption.stock <= 0)}
                >
                  {selectedOption?.stock === 0 ? 'Agotado' : 'AGREGAR'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
