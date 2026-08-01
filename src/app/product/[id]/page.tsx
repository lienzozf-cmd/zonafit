'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, Shield, ArrowLeft, Pill, Server, ZoomIn, X } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCartStore } from '@/stores/cart-store';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/placeholder/600/800';

const brandStyles: { [key: string]: string } = {
    'YoungLA': 'bg-red-600 text-white',
    'Gymshark': 'bg-cyan-400 text-black',
    'Dragon Pharma': 'bg-pink-500 text-white',
    'Darc Sport': 'bg-zinc-700 text-white',
    'RGMNT': 'bg-yellow-500 text-black',
    'RAW': 'bg-green-600 text-white',
    'Vanquish': 'bg-sky-500 text-white',
    'DFYNE': 'bg-purple-600 text-white',
    'Monster': 'bg-lime-500 text-black',
    'Bum Energy': 'bg-amber-400 text-black',
    'Dymatize': 'bg-blue-600 text-white',
    'Muscletech': 'bg-orange-600 text-white',
    'Ironbull': 'bg-zinc-500 text-white',
    'Civil Regime': 'bg-pink-600 text-white',
};

const brandButtonStyles: { [key: string]: string } = {
    'YoungLA': 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]',
    'Gymshark': 'bg-cyan-400 hover:bg-cyan-300 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]',
    'Dragon Pharma': 'bg-pink-500 hover:bg-pink-400 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]',
    'Darc Sport': 'bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-700 shadow-[0_0_15px_rgba(63,63,70,0.4)] hover:shadow-[0_0_25px_rgba(63,63,70,0.6)]',
    'RGMNT': 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)]',
    'RAW': 'bg-green-600 hover:bg-green-500 text-white border-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)]',
    'Vanquish': 'bg-sky-500 hover:bg-sky-400 text-white border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]',
    'DFYNE': 'bg-purple-600 hover:bg-purple-500 text-white border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]',
    'Monster': 'bg-lime-500 hover:bg-lime-400 text-black border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.4)] hover:shadow-[0_0_25px_rgba(132,204,22,0.6)]',
    'Bum Energy': 'bg-amber-400 hover:bg-amber-300 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)]',
    'Dymatize': 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]',
    'Muscletech': 'bg-orange-600 hover:bg-orange-500 text-white border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)]',
    'Ironbull': 'bg-zinc-500 hover:bg-zinc-400 text-white border-zinc-500 shadow-[0_0_15px_rgba(115,115,115,0.4)] hover:shadow-[0_0_25px_rgba(115,115,115,0.6)]',
    'Civil Regime': 'bg-pink-600 hover:bg-pink-500 text-white border-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.4)] hover:shadow-[0_0_25px_rgba(219,39,119,0.6)]',
};

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { id } = params || { id: '' };
  
  const products = useCartStore((state) => state.products);
  const getProductOption = useCartStore((state) => state.getProductOption);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [shouldPulseSizes, setShouldPulseSizes] = useState(false);

  useEffect(() => {
    setIsClient(true);
    window.scrollTo(0, 0); // Ensure page starts at the top
    if (products.length > 0) {
      const foundProduct = products.find((p) => p.id === Number(id));
      if (foundProduct && foundProduct.visible !== false) {
        setProduct(foundProduct);
        // Trigger play-music event with product's gender to play correct track on entry
        window.dispatchEvent(new CustomEvent('play-music', { detail: { gender: foundProduct.gender, productId: foundProduct.id } }));
        
        const initialColor = foundProduct.colors && foundProduct.colors.length > 0
          ? (foundProduct.colors.find(c => (c.options?.values || []).some(v => v.stock > 0)) || foundProduct.colors[0])
          : null;
        setSelectedColor(initialColor);
        
        const initialImg = initialColor ? initialColor.imageSrc : (foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images[0].src : PLACEHOLDER_IMAGE);
        setCurrentImage(initialImg);

        const options = initialColor?.options?.values || foundProduct.options?.values || [];
        if (options.length === 1 && options[0].value === 'Único') {
          setSelectedOption(options[0]);
        } else {
          setSelectedOption(null);
        }
      } else {
        router.push('/');
      }
    }
  }, [id, products, router]);

  const getAvailableStock = (option: ProductOption | null) => {
    if (!product || !option) return 0;
    const currentOption = getProductOption(product.id, option.value, selectedColor?.name);
    return currentOption?.stock ?? 0;
  };
  
  useEffect(() => {
    if (product) {
      updateAvailabilityMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, selectedColor, product, items]);

  const updateAvailabilityMessage = () => {
    if (!product) return;
    if (selectedOption) {
      const availableStock = getAvailableStock(selectedOption);
      setAvailabilityMessage(availableStock > 0 ? `Disponible: ${availableStock} unidades` : 'Agotado');
    } else {
      const optionType = selectedColor?.options?.type || product.options?.type || 'opción';
      setAvailabilityMessage(`Selecciona una ${optionType}`);
    }
  }

  const filteredImages = useMemo(() => {
    if (!product) return [];
    const allImages = product.images || [];
    
    if (!selectedColor) return allImages;

    // 1. Imágenes que pertenecen al color seleccionado (incluyendo detalles)
    const currentColorImages = allImages.filter(img => img.color === selectedColor.name);
    
    // 2. Imágenes genéricas (sin color asignado)
    const genericImages = allImages.filter(img => !img.color);
    
    // 3. La primera imagen representativa de cada uno de los OTROS colores
    const otherColors = (product.colors || []).filter(c => c.name !== selectedColor.name);
    const otherRepresentativeImages = otherColors.map(c => 
      allImages.find(img => img.color === c.name)
    ).filter((img): img is NonNullable<typeof img> => !!img);

    // Combinar y eliminar duplicados por URL de imagen
    const combined = [...currentColorImages, ...genericImages, ...otherRepresentativeImages];
    return combined.filter((v, i, a) => a.findIndex(t => t.src === v.src) === i);
  }, [product, selectedColor]);

  const handleColorClick = (color: ProductColor) => {
    setSelectedColor(color);
    setCurrentImage(color.imageSrc);
    
    const options = color.options?.values || [];
    if (options.length === 1 && options[0].value === 'Único') {
      setSelectedOption(options[0]);
    } else {
      setSelectedOption(null);
    }
  };

  const handleThumbnailClick = (image: { src: string; color?: string; option?: string }) => {
    setCurrentImage(image.src);
    
    // Si la imagen pertenece a un color distinto al seleccionado, cambiamos el color
    if (image.color && image.color !== selectedColor?.name && product?.colors) {
      const newColor = product.colors.find(c => c.name === image.color);
      if (newColor) {
        handleColorClick(newColor);
      }
    }

    // Si la imagen pertenece a una opción distinta a la seleccionada, cambiamos la opción
    if (image.option && image.option !== selectedOption?.value) {
      const currentOptionsValues = selectedColor?.options?.values || product?.options?.values || [];
      const newOption = currentOptionsValues.find(o => o.value === image.option);
      if (newOption) {
        setSelectedOption(newOption);
      }
    }
  };

  const handleOptionClick = (option: ProductOption) => {
    if (!product) return;
    setSelectedOption(option);

    // Si la opción tiene una imagen asociada en el array de imágenes del producto, cambiar a esa imagen
    const matchingImage = product.images?.find(img => img.option === option.value);
    if (matchingImage) {
      setCurrentImage(matchingImage.src);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
  
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: 'Error',
        description: `Por favor, selecciona un color.`,
        variant: 'destructive',
      });
      return;
    }
  
    const currentOptionsValues = selectedColor?.options?.values || product.options?.values || [];
    if (currentOptionsValues.length > 0 && (!selectedOption || (currentOptionsValues.length > 1 && selectedOption.value === 'Único'))) {
      const optionType = (selectedColor ? selectedColor.options?.type : product.options?.type) || 'opción';
      setShouldPulseSizes(true);
      setTimeout(() => setShouldPulseSizes(false), 1500);
      toast({
        title: 'Error',
        description: `Por favor, toca el botón de tu ${optionType}.`,
        variant: 'destructive',
      });
      return;
    }

    if (!selectedOption && currentOptionsValues.length > 0) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona una opción.`,
            variant: 'destructive',
        });
        return;
    }
  
    const availableStock = getAvailableStock(selectedOption);
    if (availableStock <= 0 && currentOptionsValues.length > 0) {
      toast({
        title: 'Error',
        description: `No hay stock disponible para esta selección.`,
        variant: 'destructive',
      });
      return;
    }
  
    const priceString = product.price || '0';
    const priceAsNumber = parseFloat(priceString.replace('Q.', ''));
    const optionValue = selectedOption?.value || 'Único';
    const cartItemId = selectedColor ? `${product.id}-${selectedColor.name}-${optionValue}` : `${product.id}-default-${optionValue}`;
    const cartItemName = selectedColor ? `${product.name} - ${selectedColor.name}` : product.name;
  
    addItem({
      id: cartItemId,
      productId: product.id,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: optionValue,
      color: selectedColor?.name,
      quantity: 1,
    });
  };

  if (!isClient || !product) {
    return (
      <>
        <Header />
        <div className="text-white text-center py-20">Cargando producto...</div>
        <Footer />
      </>
    );
  }

  const currentOptions = selectedColor ? selectedColor.options : product.options;
  // Disable button ONLY if size/option is selected AND is out of stock. If not selected, keep button enabled so user can tap it to get prompted.
  const isAddToCartDisabled = !!((currentOptions?.values?.length ?? 0) > 0 && selectedOption && getAvailableStock(selectedOption) <= 0);
  const isPendingOption = (currentOptions?.values?.length ?? 0) > 0 && !selectedOption;

  return (
    <>
    <Header />
    <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-10" style={{ 
          backgroundImage: "url('/assets/images/diamond-bg.png')",
          backgroundSize: '80px'
      }}></div>

      <div className="container mx-auto px-4 py-4 md:py-6 relative z-10">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 h-8 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all text-xs">
            <ArrowLeft className="mr-2 h-3 w-3" />
            VOLVER
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Gallery Section - More compact */}
          <div className="lg:col-span-6 space-y-4">
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
              <DialogTrigger asChild>
                <div className="relative aspect-square w-full max-h-[500px] mx-auto overflow-hidden rounded-xl bg-zinc-900/30 border border-zinc-800/50 shadow-xl group cursor-zoom-in">
                  <Image
                    src={currentImage || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    fill
                    unoptimized
                    priority
                    onError={() => setCurrentImage(PLACEHOLDER_IMAGE)}
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-black/95 shadow-none flex items-center justify-center z-[200]">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">Imagen ampliada de {product.name}</DialogDescription>
                
                <DialogClose className="fixed top-6 right-6 sm:top-10 sm:right-10 p-4 bg-red-600 hover:bg-red-700 rounded-full text-white transition-all shadow-[0_0_30px_rgba(229,0,0,0.6)] z-[210] scale-125 active:scale-95 border-2 border-white/30 flex items-center justify-center">
                    <X className="w-8 h-8 stroke-[4px]" />
                </DialogClose>

                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-10">
                  <Image
                    src={currentImage || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    width={1600}
                    height={1600}
                    unoptimized
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
              {filteredImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImage === image.src ? 'border-red-600 scale-105 shadow-[0_0_10px_rgba(229,0,0,0.3)]' : 'border-zinc-800 hover:border-zinc-600 opacity-50 hover:opacity-100'}`}
                  onClick={() => handleThumbnailClick(image)}
                >
                  <Image
                    src={image.src}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section - Tighter spacing */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 ${brandStyles[product.brand] || 'bg-zinc-800 text-white'} text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg`}>
                  {product.brand}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  / {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <p className="text-3xl font-black text-red-600 tracking-tighter">
                  {product.price}
                </p>
                {product.originalPrice && (
                    <p className="text-lg text-zinc-700 line-through font-bold">
                        {product.originalPrice}
                    </p>
                )}
              </div>
            </div>

            {/* Characteristics Grid - Garment Specific */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                    { 
                        text: product.feature1 || "Corte Atlético Profesional", 
                        icon: <Check className="h-3 w-3" /> 
                    },
                    { 
                        text: product.fabric_type ? `Tela: ${product.fabric_type}` : (product.category === 'suplemento' ? product.servings_info : "Mezcla de Fibras Premium"), 
                        icon: <Check className="h-3 w-3" /> 
                    },
                    { 
                        text: product.category === 'ropa' ? (product.is_compression ? "Sistema de Compresión" : "Tejido Transpirable") : (product.benefits?.split(',')[0] || "Máxima Calidad"), 
                        icon: <Check className="h-3 w-3" /> 
                    },
                    { 
                        text: product.feature2 || "Costuras de Alta Resistencia", 
                        icon: <Check className="h-3 w-3" /> 
                    }
                ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-zinc-900/40 rounded-lg border border-zinc-800/40 hover:border-red-600/30 transition-colors group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                            <Check className="h-3 w-3 text-red-500 group-hover:text-white" />
                        </div>
                        <span className="text-[15px] font-bold text-zinc-300 group-hover:text-white leading-tight">
                            {feat.text}
                        </span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-[15px] font-black text-zinc-500 uppercase tracking-widest">Descripción</h3>
                    <p className="text-lg md:text-xl text-zinc-100 font-bold leading-tight">
                        {product.description}
                    </p>
                </div>

                {/* Options Selection - Grid for perfect alignment */}
                <div className="space-y-6">
                    {product.colors && product.colors.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-[15px] font-black text-zinc-500 uppercase tracking-widest">
                                {product.category === 'suplemento' ? 'Sabor' : 'Color'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {product.colors.map(color => {
                                    const colorOptions = color.options?.values || [];
                                    const isColorSoldOut = colorOptions.every(v => (getProductOption(product.id, v.value, color.name)?.stock ?? 0) === 0);
                                    const isSelected = selectedColor?.name === color.name;
                                    return (
                                        <button 
                                            key={color.name} 
                                            onClick={() => !isColorSoldOut && handleColorClick(color)} 
                                            disabled={isColorSoldOut} 
                                            className={`relative w-full px-4 py-3 rounded-lg border text-[15px] font-black transition-all text-center ${
                                                isColorSoldOut 
                                                    ? (isSelected 
                                                        ? 'border-red-600/80 bg-zinc-950/50 text-zinc-300 opacity-80 cursor-not-allowed'
                                                        : 'border-zinc-900 bg-zinc-950/50 text-zinc-600 opacity-40 cursor-not-allowed'
                                                      )
                                                    : (isSelected 
                                                        ? 'bg-red-600 border-red-600 text-white shadow-lg'
                                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                      )
                                            }`}
                                        >
                                            {color.name}
                                            {isColorSoldOut && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg className="w-full h-full absolute inset-0 text-red-600/80" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
                                                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    
                    {currentOptions && currentOptions.values && !(currentOptions.values.length === 1 && currentOptions.values[0].value === 'Único') && (
                        <div className={`space-y-3 p-2 rounded-xl transition-all duration-300 ${shouldPulseSizes ? 'bg-amber-500/10 ring-2 ring-amber-500/80 scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''}`}>
                            <h3 className="text-[15px] font-black text-zinc-500 uppercase tracking-widest">
                                {currentOptions.type}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {currentOptions.values.map((option) => {
                                    const stock = getAvailableStock(option);
                                    const isSelected = selectedOption?.value === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={stock === 0}
                                            className={`relative px-4 py-3 rounded-lg border text-[15px] font-black transition-all text-center ${
                                                stock === 0
                                                    ? (isSelected
                                                        ? 'border-red-600/80 bg-zinc-950/50 text-zinc-300 opacity-80 cursor-not-allowed'
                                                        : 'border-zinc-900 bg-zinc-950/50 text-zinc-600 opacity-40 cursor-not-allowed'
                                                      )
                                                    : (isSelected
                                                        ? 'bg-red-600 border-red-600 text-white shadow-lg'
                                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                      )
                                            }`}
                                        >
                                            {option.value}
                                            {stock === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg className="w-full h-full absolute inset-0 text-red-600/80" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
                                                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between text-[14px] font-black uppercase tracking-widest px-1 py-1">
                        {currentOptions && currentOptions.values && !(currentOptions.values.length === 1 && currentOptions.values[0].value === 'Único') ? (
                            selectedOption ? (
                                getAvailableStock(selectedOption) > 0 ? (
                                    <div className="flex items-center gap-2 text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                        <span>DISPONIBLE ({getAvailableStock(selectedOption)} UNIDADES)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-500 font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                        <span>AGOTADO</span>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center gap-2 text-amber-500 font-black animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    <span>TOCA UN BOTÓN DE TALLA PARA VER DISPONIBILIDAD</span>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span>DISPONIBLE</span>
                            </div>
                        )}
                    </div>
                    
                    {product.category === 'ropa' && (
                      <Button
                        type="button"
                        onClick={() => router.push('/#size-finder-section')}
                        className={`w-full font-black py-5 text-sm rounded-xl transition-all active:scale-95 uppercase tracking-wider border flex items-center justify-center gap-2 mb-3 animate-pulse ${
                          brandButtonStyles[product.brand] || 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                        }`}
                      >
                        📐 ¿Cuál es mi Talla? Encontrarla aquí
                      </Button>
                    )}

                    <Button
                        className={`w-full font-black py-6 text-lg rounded-xl transition-all active:scale-95 group overflow-hidden relative ${
                          isPendingOption 
                            ? 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]'
                        }`}
                        onClick={handleAddToCart}
                        disabled={isAddToCartDisabled}
                    >
                        <span className="relative z-10 uppercase tracking-tighter flex items-center justify-center gap-2">
                            {isPendingOption ? (
                                <>
                                    <span>👉 TOCA EL BOTÓN DE TU {currentOptions?.type === 'Talla' ? 'TALLA' : currentOptions?.type === 'Sabor' ? 'SABOR' : 'OPCIÓN'}</span>
                                </>
                            ) : (
                                isAddToCartDisabled ? 'AGOTADO' : 'AÑADIR AL CARRITO'
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProductDetailPage;

