'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/cart-store';
import { X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  sessionId: string;
  index: number;
}

const ProductCard = ({ product: initialProduct, sessionId, index }: ProductCardProps) => {
  const { addItem, getProductOption } = useCartStore((state) => ({
    addItem: state.addItem,
    getProductOption: state.getProductOption,
  }));
  
  // The initial product from server props is sufficient.
  const product = initialProduct;

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  // Memoize the initial option calculation
  const initialOption = useMemo(() => {
    const options = selectedColor?.options.values || product.options?.values || [];
    const firstAvailableOption = options.find(o => o.stock > 0);
    if (options.length === 1 && options[0].value === 'Único') {
      return options[0];
    }
    return firstAvailableOption || null;
  }, [product, selectedColor]);

  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(initialOption);
  const [currentImage, setCurrentImage] = useState(selectedColor?.imageSrc || product.images[0].src);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // When selectedColor changes, reset selectedOption
    const options = selectedColor?.options.values || product.options?.values || [];
    const firstAvailableOption = options.find(o => o.stock > 0);
    if (options.length === 1 && options[0].value === 'Único') {
        setSelectedOption(options[0]);
    } else {
        setSelectedOption(firstAvailableOption || null);
    }
  }, [selectedColor, product.options.values]);

  useEffect(() => {
    const stock = selectedOption ? selectedOption.stock : 0;
    if (selectedOption) {
      setAvailabilityMessage(stock > 0 ? `Disponible: ${stock} unidades` : 'Agotado');
    } else {
      const totalStock = (selectedColor?.options.values || product.options?.values || []).reduce((sum, o) => sum + o.stock, 0);
      if (totalStock > 0) {
        const optionType = selectedColor?.options.type || product.options?.type || 'opción';
        setAvailabilityMessage(`Selecciona un ${optionType}`);
      } else {
        setAvailabilityMessage('Agotado');
      }
    }
  }, [selectedOption, selectedColor, product]);


  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedOption(option);
  };

  const handleColorHover = (color: ProductColor) => {
    if (color.name !== selectedColor?.name) {
      const isColorSoldOut = color.options.values.every(v => v.stock === 0);
      if (isColorSoldOut) return;
      
      setCurrentImage(color.imageSrc);
      setSelectedColor(color);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast({ title: 'Error', description: `Por favor, selecciona un color.`, variant: 'destructive' });
        return;
    }
    
    if (!selectedOption) {
      const optionType = (selectedColor?.options.type || product.options.type) || 'opción';
      toast({ title: 'Error', description: `Por favor, selecciona una ${optionType}.`, variant: 'destructive' });
      return;
    }
    
    const availableStock = getProductOption(product.id, selectedOption.value, selectedColor?.name)?.stock ?? 0;
    
    if (availableStock <= 0) {
      toast({ title: 'Error', description: `No hay stock disponible para esta selección.`, variant: 'destructive' });
      return;
    }
    
    const priceAsNumber = parseFloat((product.price || '0').replace('Q.', ''));
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
      quantity: 1
    });
  };
  
  const isProductAvailable = useMemo(() => 
    product.options?.values.some(v => v.stock > 0) || 
    (product.colors && product.colors.some(c => c.options.values.some(v => v.stock > 0))),
    [product]
  );

  const showOptions = !((selectedColor?.options.values.length === 1 && selectedColor?.options.values[0].value === 'Único') || (product.options.values.length === 1 && product.options.values[0].value === 'Único'));
  const optionsToShow = selectedColor?.options.values || product.options.values;
  const isAddToCartDisabled = !selectedOption || (selectedOption?.stock ?? 0) <= 0;

  const productUrl = `/product/${product.id}?pos=${index}&sid=${sessionId}`;

  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
        onMouseLeave={() => setCurrentImage(selectedColor?.imageSrc || product.images[0].src)}
    >
        <Link href={productUrl} className="product-image-link w-full">
            <div className="product-carousel">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
            </div>
        </Link>
        <div className='flex flex-col flex-grow mt-4'>
            <Link href={productUrl}>
                <h3 className="product-name">{product.name}</h3>
            </Link>
            <div className="flex justify-center items-center gap-2">
                <p className="product-price">{product.price}</p>
            </div>
            <div className="flex justify-center my-2">
                 <div className={`product-availability ${isProductAvailable ? 'available' : 'unavailable'}`}>{isProductAvailable ? 'Disponible' : 'Agotado'}</div>
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
                                        border: selectedColor?.name === color.name ? '2px solid var(--accent-color)' : '2px solid white',
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
                {showOptions && (
                    <div className="size-options">
                    {optionsToShow.map((option) => {
                      const isOptionDisabled = option.stock <= 0;
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
