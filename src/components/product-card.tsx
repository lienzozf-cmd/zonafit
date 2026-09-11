'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/cart-store';

interface ProductCardProps {
  product: Product;
  sessionId: string;
  index: number;
}

const brandColorMap: { [key: string]: string } = {
    'Gymshark': 'text-cyan-400 animate-pulse',
    'YoungLA': 'text-accent animate-pulse',
    'Dragon Pharma': 'text-pink-500 animate-pulse',
    'Darc Sport': 'text-gray-200 animate-pulse',
    'RGMNT': 'text-yellow-400 animate-pulse',
    'Civil Regime': 'text-pink-500 animate-pulse',
    'RAW': 'text-green-500 animate-pulse',
    'Vanquish': 'text-sky-400 animate-pulse',
    'DFYNE': 'text-purple-400 animate-pulse',
    'Monster': 'text-lime-500 animate-pulse',
    'Bum Energy': 'text-amber-400 animate-pulse',
    'Dymatize': 'text-blue-500 animate-pulse',
    'Muscletech': 'text-orange-500 animate-pulse',
    'Ironbull': 'text-neutral-400 animate-pulse',
    'Breathe Divinity': 'text-red-500 animate-pulse',
};

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/placeholder/600/800';

const ProductCard = ({ product: initialProduct, sessionId, index }: ProductCardProps) => {
  const products = useCartStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);
  const getProductOption = useCartStore((state) => state.getProductOption);
  
  const product = useMemo(() => 
    products.find(p => String(p.id) === String(initialProduct.id)) || initialProduct,
    [products, initialProduct]
  );

  // Obtener el primer color disponible con stock > 0, o fallback al primero
  const getFirstAvailableColor = (prod: Product): ProductColor | null => {
    if (!prod.colors || prod.colors.length === 0) return null;
    const availableColor = prod.colors.find(c =>
      (c.options?.values || []).some(v => (getProductOption(prod.id, v.value, c.name)?.stock ?? 0) > 0)
    );
    return availableColor || prod.colors[0];
  };

  // Obtener la primera opción disponible con stock > 0
  const getFirstAvailableOption = (prod: Product, color: ProductColor | null): ProductOption | null => {
    const options = color?.options?.values || prod.options?.values || [];
    const availableOption = options.find(o => (getProductOption(prod.id, o.value, color?.name)?.stock ?? 0) > 0);
    if (options.length === 1 && options[0].value === 'Único') {
      const isUniqueAvailable = (getProductOption(prod.id, options[0].value, color?.name)?.stock ?? 0) > 0;
      return isUniqueAvailable ? options[0] : null;
    }
    return availableOption || null;
  };

  const getProductImage = (prod: Product, color: ProductColor | null, opt: ProductOption | null) => {
    // 1. Si la opción tiene una imagen específica asociada
    if (opt) {
      const optionImg = prod.images?.find(img => img.option === opt.value);
      if (optionImg?.src) return optionImg.src;
    }
    // 2. Si el color tiene imagen directa
    if (color?.imageSrc) return color.imageSrc;
    // 3. Si en images hay una imagen con la etiqueta de ese color
    if (color) {
      const colorImg = prod.images?.find(img => img.color === color.name);
      if (colorImg?.src) return colorImg.src;
    }
    // 4. Imagen general del producto
    if (prod.images && prod.images.length > 0) {
      if (prod.id === 3037 && prod.images[1]) {
        return prod.images[1].src;
      }
      return prod.images[0].src;
    }
    return PLACEHOLDER_IMAGE;
  };

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() => getFirstAvailableColor(product));
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(() => getFirstAvailableOption(product, selectedColor));
  const [currentImage, setCurrentImage] = useState<string>(() => getProductImage(product, selectedColor, selectedOption));
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    const nextColor = getFirstAvailableColor(product);
    setSelectedColor(nextColor);
    const nextOption = getFirstAvailableOption(product, nextColor);
    setSelectedOption(nextOption);
    setCurrentImage(getProductImage(product, nextColor, nextOption));
  }, [product, getProductOption]);

  useEffect(() => {
    const options = selectedColor?.options?.values || product.options?.values || [];
    const firstAvailableOption = options.find(o => (getProductOption(product.id, o.value, selectedColor?.name)?.stock ?? 0) > 0);
    let currentOpt = null;
    if (options.length === 1 && options[0].value === 'Único') {
        const isUniqueAvailable = (getProductOption(product.id, options[0].value, selectedColor?.name)?.stock ?? 0) > 0;
        currentOpt = isUniqueAvailable ? options[0] : null;
    } else {
        currentOpt = firstAvailableOption || null;
    }
    setSelectedOption(currentOpt);
    setCurrentImage(getProductImage(product, selectedColor, currentOpt));
  }, [selectedColor, product, getProductOption]);

  useEffect(() => {
    if (!product) return;
  
    const stock = selectedOption ? getProductOption(product.id, selectedOption.value, selectedColor?.name)?.stock ?? 0 : 0;
  
    if (selectedOption) {
      if (stock === 1) {
        setAvailabilityMessage('🔥 ¡Últimas existencias! (1 disponible)');
      } else if (stock > 1) {
        setAvailabilityMessage(`Disponible: ${stock} unidades`);
      } else {
        setAvailabilityMessage('Agotado');
      }
    } else {
      const options = selectedColor?.options?.values || product.options?.values || [];
      const totalStock = options.reduce((sum, o) => {
        const optionStock = getProductOption(product.id, o.value, selectedColor?.name)?.stock ?? 0;
        return sum + optionStock;
      }, 0);
  
      if (totalStock > 0) {
        const optionType = selectedColor?.options?.type || product.options?.type || 'opción';
        setAvailabilityMessage(`Selecciona un ${optionType}`);
      } else {
        setAvailabilityMessage('Agotado');
      }
    }
  }, [selectedOption, selectedColor, product, getProductOption]);

  const handleOptionClick = (e: React.MouseEvent, option: ProductOption) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedOption(option);

    // Si la opción tiene una imagen asociada, cambiar a esa imagen
    const matchingImage = product.images?.find(img => img.option === option.value);
    if (matchingImage) {
      setCurrentImage(matchingImage.src);
    }
  };

  const handleColorHover = (color: ProductColor) => {
    if (color.name !== selectedColor?.name) {
      const colorOptions = color.options?.values || [];
      const isColorSoldOut = colorOptions.every(v => (getProductOption(product.id, v.value, color.name)?.stock ?? 0) === 0);
      if (isColorSoldOut) return;
      
      setSelectedColor(color);
      const nextOpt = getFirstAvailableOption(product, color);
      setSelectedOption(nextOpt);
      setCurrentImage(getProductImage(product, color, nextOpt));
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
      const optionType = (selectedColor?.options?.type || product.options?.type) || 'opción';
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
  
  const isProductAvailable = useMemo(() => {
    if (product.availability === 'Agotado') return false;
    const checkStock = (p: Product) => {
      if (p.colors && p.colors.length > 0) {
        return p.colors.some(c => (c.options?.values || []).some(v => (getProductOption(p.id, v.value, c.name)?.stock ?? 0) > 0));
      }
      return (p.options?.values || []).some(v => (getProductOption(p.id, v.value)?.stock ?? 0) > 0);
    }
    return checkStock(product);
  }, [product, getProductOption]);

  const productOptionsValues = product.options?.values || [];
  const selectedColorOptionsValues = selectedColor?.options?.values || [];

  const showOptions = !((selectedColorOptionsValues.length === 1 && selectedColorOptionsValues[0].value === 'Único') || (productOptionsValues.length === 1 && productOptionsValues[0].value === 'Único'));
  const optionsToShow = selectedColor ? (selectedColor.options?.values || []) : (product.options?.values || []);
  const isAddToCartDisabled = !selectedOption || (getProductOption(product.id, selectedOption.value, selectedColor?.name)?.stock ?? 0) <= 0;

  const productUrl = `/product/${product.id}?pos=${index}&sid=${sessionId}`;

  return (
    <div 
        className="product-item flex flex-col"
        id={`product-item-${product.id}`}
        onMouseLeave={() => {
          setCurrentImage(getProductImage(product, selectedColor, selectedOption));
        }}
    >
        <Link 
            href={productUrl} 
            className="product-image-link w-full"
            onClick={() => window.dispatchEvent(new CustomEvent('play-music', { detail: { gender: product.gender, productId: product.id } }))}
        >
            <div className="product-carousel">
                <Image
                  src={currentImage ? encodeURI(currentImage) : PLACEHOLDER_IMAGE}
                  alt={product.name}
                  fill
                  unoptimized
                  onError={() => setCurrentImage(PLACEHOLDER_IMAGE)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
            </div>
        </Link>
        <div className='flex flex-col flex-grow mt-4'>
            <p className={`font-semibold text-sm mb-1 uppercase tracking-wider ${brandColorMap[product.brand] || 'text-gray-300'}`}>{product.brand}</p>
            <Link 
                href={productUrl}
                onClick={() => window.dispatchEvent(new CustomEvent('play-music', { detail: { gender: product.gender, productId: product.id } }))}
            >
                <h3 className="product-name">{product.name}</h3>
            </Link>
            <div className="flex justify-center items-center gap-2">
                <p className="product-price">{product.price}</p>
                {product.originalPrice && (
                    <p className="text-sm text-zinc-500 line-through font-bold">{product.originalPrice}</p>
                )}
            </div>
            <div className="flex justify-center my-2">
                 <div className={`product-availability ${isProductAvailable ? 'available' : 'unavailable'}`}>{isProductAvailable ? 'Disponible' : 'Agotado'}</div>
            </div>

            {product.colors && product.colors.length > 1 && (
                <div className="color-swatches">
                    {product.colors.map((color) => {
                        const colorOptions = color.options?.values || [];
                        const isColorSoldOut = colorOptions.every(v => (getProductOption(product.id, v.value, color.name)?.stock ?? 0) === 0);
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
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleColorHover(color); }}
                                />
                                {isColorSoldOut && <span className="sold-out-x-swatch">X</span>}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="product-info mt-auto">
                {showOptions && optionsToShow.length > 0 && (
                    <div className="size-options">
                    {optionsToShow.map((option) => {
                      const stock = getProductOption(product.id, option.value, selectedColor?.name)?.stock ?? 0;
                      const isOptionDisabled = stock <= 0;
                      const isSelected = selectedOption?.value === option.value && !isOptionDisabled;
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
