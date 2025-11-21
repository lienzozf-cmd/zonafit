'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from './store-provider';


interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product: initialProduct }: ProductCardProps) => {
  const { products, getItem, getProductOption, addItem } = useCartStore((state) => ({
    products: state.products,
    getItem: state.getItem,
    getProductOption: state.getProductOption,
    addItem: state.addItem,
  }));

  const product = products.find((p) => p.id === initialProduct.id) || initialProduct;

  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState(product.images[0].src);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const { toast } = useToast();

  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  const getAvailableStock = (option: ProductOption | null) => {
    if (!product || !option) return 0;
    
    const currentOption = getProductOption(product.id, option.value, selectedColor?.name);
    const originalStock = currentOption?.stock ?? 0;
    
    const itemInCart = getItem(selectedColor ? `${product.id}-${selectedColor.name}-${option.value}` : `${product.id}-default-${option.value}`);
    const stockInCart = itemInCart?.quantity || 0;

    return originalStock - stockInCart;
  };
  
  useEffect(() => {
    updateAvailabilityMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedOption, selectedColor, getItem]);
  
  const updateAvailabilityMessage = () => {
    if (selectedOption) {
      const availableStock = getAvailableStock(selectedOption);
      setAvailabilityMessage(availableStock > 0 ? `Disponible: ${availableStock} unidades` : 'Agotado');
    } else if (product.options.values.length === 1 && product.options.values[0].value === 'Único') {
      const uniqueOption = product.options.values[0];
      setSelectedOption(uniqueOption);
    } else if (product.colors && product.colors.length > 0) {
      setAvailabilityMessage(`Selecciona un color y talla`);
    } else {
      setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }
  };

  useEffect(() => {
    // Update image based on selected color or option
    if(selectedColor) {
      const imageForColor = product.images.find(img => img.color === selectedColor.name);
      setCurrentImage(imageForColor ? imageForColor.src : selectedColor.imageSrc);
    }
    const imageForOption = product.images.find(img => img.option === selectedOption?.value && (selectedColor ? img.color === selectedColor.name : true));
    if (imageForOption) {
      setCurrentImage(imageForOption.src);
    }
  }, [selectedOption, selectedColor, product]);


  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation(); // Prevent link navigation
    e.preventDefault();
    setSelectedOption(prev => (prev?.value === option.value ? null : option));
  };

  const handleColorHover = (color: ProductColor) => {
    setCurrentImage(color.imageSrc);
    setSelectedColor(color);
    setSelectedOption(null); // Reset size selection when color changes
    setAvailabilityMessage(`Selecciona un ${color.options.type || product.options.type}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent link navigation
    e.preventDefault();
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona un color.`,
            variant: 'destructive',
        });
        return;
    }
    
    if (!selectedOption) {
      const optionType = (selectedColor ? selectedColor.options.type : product.options.type) || 'opción';
      toast({
        title: 'Error',
        description: `Por favor, selecciona una ${optionType}.`,
        variant: 'destructive',
      });
      return;
    }
    
    const availableStock = getAvailableStock(selectedOption);
    if (availableStock <= 0) {
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
      productId: product.id,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: selectedOption.value,
      color: selectedColor?.name,
      quantity: 1,
    });
    
    toast({
      title: 'Agregado al carrito',
      description: `${cartItemName} (${selectedOption.value}) ha sido agregado a tu carrito.`,
    });
    updateAvailabilityMessage();
  };
  
  const isAvailable = product.colors
    ? product.colors.some(c => c.options.values.some(v => v.stock > 0))
    : product.options.values.some(v => v.stock > 0);

  const showOptions = !(product.options.values.length === 1 && product.options.values[0].value === 'Único') || (product.colors && product.colors.length > 0);
  const optionsToShow = selectedColor?.options.values || product.options.values;
  const isAddToCartDisabled = !selectedOption || getAvailableStock(selectedOption) <= 0;

  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
        onMouseLeave={() => {
            if (product.colors && product.colors.length > 0 && selectedColor) {
                setCurrentImage(selectedColor.imageSrc);
            } else {
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
                    {optionsToShow.map((option) => {
                      const stock = getAvailableStock(option);
                      const isOptionDisabled = stock <= 0;
                      return (
                        (option.value !== 'Único') &&
                        <button
                          key={option.value}
                          onClick={(e) => handleOptionClick(e, option)}
                          className={selectedOption?.value === option.value ? 'active' : ''}
                          disabled={isOptionDisabled}
                        >
                          {option.value}
                        </button>
                      )
                    })}
                    </div>
                )}
                <p className="availability-message">
                    {availabilityMessage}
                </p>
                <button 
                    className="add-to-cart-button" 
                    onClick={handleAddToCart} 
                    disabled={isAddToCartDisabled}
                >
                  {isAddToCartDisabled && selectedOption ? 'Agotado' : 'AGREGAR'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
