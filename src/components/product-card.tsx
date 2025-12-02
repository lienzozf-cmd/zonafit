
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/cart-store';
import { X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product: initialProduct }: ProductCardProps) => {
  const { products, addItem, getProductOption, items } = useCartStore((state) => ({
    products: state.products,
    addItem: state.addItem,
    getProductOption: state.getProductOption,
    items: state.items
  }));

  const product = products.find((p) => p.id === initialProduct.id) || initialProduct;

  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState(product.images[0].src);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const { toast } = useToast();
  
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set initial option on mount
    const options = selectedColor?.options.values || product.options?.values || [];
    const firstAvailableOption = options.find(o => getAvailableStock(o) > 0);

    if (firstAvailableOption) {
      setSelectedOption(firstAvailableOption);
    } else if (options.length > 0) {
      setSelectedOption(options[0]); // Select first option even if unavailable
    } else {
      setSelectedOption(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, selectedColor]);
  
  const getAvailableStock = (option: ProductOption | null) => {
    if (!product || !option) return 0;
    
    const currentOption = getProductOption(product.id, option.value, selectedColor?.name);
    return currentOption?.stock ?? 0;
  };
  
  useEffect(() => {
    updateAvailabilityMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, selectedColor, items, product]);

  
  const updateAvailabilityMessage = () => {
    if (selectedOption) {
      const availableStock = getAvailableStock(selectedOption);
      setAvailabilityMessage(availableStock > 0 ? `Disponible: ${availableStock} unidades` : 'Agotado');
    } else {
      const totalStock = (selectedColor?.options.values || product.options.values).reduce((sum, o) => sum + o.stock, 0);
      if (totalStock > 0) {
        const optionType = selectedColor?.options.type || product.options.type || 'opción';
        setAvailabilityMessage(`Selecciona un ${optionType}`);
      } else {
        setAvailabilityMessage('Agotado');
      }
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
    const isColorSoldOut = color.options.values.every(v => v.stock === 0);
    if (isColorSoldOut) return;

    setCurrentImage(color.imageSrc);
    setSelectedColor(color);
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
    
    const priceAsNumber = parseFloat(product.price.replace(/[^0-9.]/g, ''));
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
    
  };
  
  const isAvailable = product.options?.values.some(v => v.stock > 0) || 
  (product.colors && product.colors.some(c => c.options.values.some(v => v.stock > 0)));


  const showOptions = !((selectedColor?.options.values.length === 1 && selectedColor?.options.values[0].value === 'Único') || (product.options.values.length === 1 && product.options.values[0].value === 'Único'));
  const optionsToShow = selectedColor?.options.values || product.options.values;
  const isAddToCartDisabled = !selectedOption || (isClient && getAvailableStock(selectedOption) <= 0);

  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
        onMouseLeave={() => {
            if (product.colors && product.colors.length > 0 && selectedColor) {
                const imageForColor = product.images.find(img => img.color === selectedColor.name);
                setCurrentImage(imageForColor ? imageForColor.src : selectedColor.imageSrc);
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
                    {product.colors.map((color) => {
                        const isColorSoldOut = color.options.values.every(v => v.stock === 0);
                        return (
                            <div key={color.name} className="relative">
                                <div
                                    className="color-swatch"
                                    style={{ 
                                        backgroundColor: color.hex,
                                        cursor: isColorSoldOut ? 'not-allowed' : 'pointer',
                                    }}
                                    onMouseEnter={() => handleColorHover(color)}
                                />
                                {isColorSoldOut && <span className="sold-out-x-swatch">X</span>}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="product-info mt-auto">
                {showOptions && isClient && (
                    <div className="size-options">
                    {optionsToShow.map((option) => {
                      const stock = getAvailableStock(option);
                      const isOptionDisabled = stock <= 0;
                      const isSelected = selectedOption?.value === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={(e) => handleOptionClick(e, option)}
                          className={isSelected ? 'active' : ''}
                          disabled={isOptionDisabled}
                        >
                          {option.value}
                           {isOptionDisabled && <span className="sold-out-x">X</span>}
                        </button>
                      )
                    })}
                    </div>
                )}
                <p className="availability-message">
                    {isClient ? availabilityMessage : ''}
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
