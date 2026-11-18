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

const PLACEHOLDER_IMAGE = '/assets/images/logos/logo.webp';

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
        setAvailabilityMessage('🔥 Última unidad disponible');
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

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_name: cartItemName,
        content_ids: [product.id.toString()],
        content_type: 'product',
        value: priceAsNumber,
        currency: 'GTQ',
      });
    }
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

  const basePriceNum = useMemo(() => {
    const cleanStr = (product.price || '0').replace(/^Q\.?\s*/i, '').replace(/,/g, '').trim();
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  }, [product.price]);

  const isNew = [9112, 9113, 9114].includes(Number(product.id));

  return (
    <article
        className="product-item product-card-luxe flex flex-col group relative"
        id={`product-item-${product.id}`}
        onMouseLeave={() => {
          setCurrentImage(getProductImage(product, selectedColor, selectedOption));
        }}
    >
        {isNew && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <div className="relative bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black text-[10px] sm:text-[11px] tracking-widest uppercase px-2.5 py-0.5 rounded shadow-[0_4px_12px_rgba(167,139,250,0.5),0_0_8px_rgba(255,255,255,0.4)] border-2 border-white flex items-center gap-1.5 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>NUEVO</span>
            </div>
          </div>
        )}
        <Link prefetch={false}
            href={productUrl} 
            className="product-image-link w-full"
            onClick={() => window.dispatchEvent(new CustomEvent('play-music', { detail: { gender: product.gender, productId: product.id } }))}
        >
            <div className="product-carousel">
                <Image
                  src={currentImage || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  fill
                  priority={index < 4}
                  quality={80}
                  onError={() => setCurrentImage(PLACEHOLDER_IMAGE)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain"
                />
            </div>
        </Link>
        <div className="product-card-content">
            <p className={`product-brand font-semibold uppercase tracking-wider ${brandColorMap[product.brand] || 'text-gray-300'}`}>{product.brand}</p>
            <Link prefetch={false}
                href={productUrl} 
                onClick={() => window.dispatchEvent(new CustomEvent('play-music', { detail: { gender: product.gender, productId: product.id } }))}
            >
                <h3 className="product-name">{product.name}</h3>
            </Link>

            <div className="product-price-row">
              <p className="product-price">
                <span className="product-currency">Q</span>
                {basePriceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-zinc-600 line-through font-bold">{product.originalPrice}</p>
              )}
            </div>

            <div className="product-status-row">
                 <div className={`product-availability ${isProductAvailable ? 'available' : 'unavailable'} ${isProductAvailable && availabilityMessage.startsWith('🔥') ? 'last-unit' : ''}`}>{isProductAvailable ? (availabilityMessage || 'Disponible') : 'Agotado'}</div>
            </div>

            <div className="product-info mt-auto">
                {showOptions && optionsToShow.length > 0 && (
                    <div className="size-options" role="group" aria-label={selectedColor?.options?.type || product.options?.type || 'Talla'}>
                    {optionsToShow.map((option) => {
                      const stock = getProductOption(product.id, option.value, selectedColor?.name)?.stock ?? 0;
                      const isOptionDisabled = stock <= 0;
                      const isSelected = selectedOption?.value === option.value && !isOptionDisabled;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={`${option.value}${isOptionDisabled ? ' — agotado' : ''}`}
                          onClick={(e) => handleOptionClick(e, option)}
                          className={isSelected ? 'active' : ''}
                          disabled={isOptionDisabled}
                        >
                          {option.value}
                        </button>
                      )
                    })}
                    </div>
                )}
            {product.colors && product.colors.length > 1 && (
                <div className="product-color-row">
                  <div className="color-swatches" role="group" aria-label="Color">
                    {product.colors.map((color) => {
                        const colorOptions = color.options?.values || [];
                        const isColorSoldOut = colorOptions.every(v => (getProductOption(product.id, v.value, color.name)?.stock ?? 0) === 0);
                        return (
                            <div key={color.name} className="relative">
                                <button
                                    type="button"
                                    aria-label={`${color.name}${isColorSoldOut ? ' — agotado' : ''}`}
                                    aria-pressed={selectedColor?.name === color.name}
                                    disabled={isColorSoldOut}
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
                  <p className="product-color-name">{selectedColor?.name}</p>
                </div>
            )}


                <button 
                    className="add-to-cart-button"
                    type="button"
                    aria-label={`${!isProductAvailable ? 'Agotado' : 'Añadir al carrito'}: ${product.name}`}
                    onClick={handleAddToCart} 
                    disabled={isAddToCartDisabled}
                >
                  {!isProductAvailable ? 'Agotado' : 'Añadir al carrito'}
                </button>
            </div>
        </div>
    </article>
  );
};

export default ProductCard;
