'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, Shield, ArrowLeft, Pill, Server, X } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCartStore } from '@/stores/cart-store';


const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { id } = params!;
  
  const { products, getProductOption, addItem, items } = useCartStore((state) => ({
    products: state.products,
    getProductOption: state.getProductOption,
    addItem: state.addItem,
    items: state.items,
  }));

  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (products.length > 0) {
      const foundProduct = products.find((p) => p.id === Number(id));
      if (foundProduct && foundProduct.visible !== false) {
        setProduct(foundProduct);
        const initialColor = foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : null;
        setSelectedColor(initialColor);
        setCurrentImage(initialColor ? initialColor.imageSrc : foundProduct.images[0].src);

        const options = initialColor?.options.values || foundProduct.options?.values || [];
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
      const optionType = selectedColor?.options.type || product.options?.type || 'opción';
      setAvailabilityMessage(`Selecciona un ${optionType}`);
    }
  }


  const handleColorClick = (color: ProductColor) => {
    setSelectedColor(color);
    setCurrentImage(color.imageSrc);
    
    const options = color.options.values;
    // For products like supplements, if there's only one option ('Único'), select it automatically.
    if (options.length === 1 && options[0].value === 'Único') {
      setSelectedOption(options[0]);
    } else {
      setSelectedOption(null); // For other products, require the user to select a size/option.
    }
  };

  const handleOptionClick = (option: ProductOption) => {
    if (!product) return;
    setSelectedOption(option);
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
  
    if (product.options && (!selectedOption || (product.options.values.length > 1 && selectedOption.value === 'Único'))) {
      const optionType = (selectedColor ? selectedColor.options.type : product.options.type) || 'opción';
      toast({
        title: 'Error',
        description: `Por favor, selecciona una ${optionType}.`,
        variant: 'destructive',
      });
      return;
    }

    if (!selectedOption) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona una opción.`,
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
  
    const priceString = product.price || '0';
    const priceAsNumber = parseFloat(priceString.replace('Q.', ''));
    const cartItemId = selectedColor ? `${product.id}-${selectedColor.name}-${selectedOption!.value}` : `${product.id}-default-${selectedOption!.value}`;
    const cartItemName = selectedColor ? `${product.name} - ${selectedColor.name}` : product.name;
  
  
    addItem({
      id: cartItemId,
      productId: product.id,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: selectedOption!.value,
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
  const isAddToCartDisabled = !selectedOption || getAvailableStock(selectedOption) <= 0;

  return (
    <>
    <Header />
    <div className="bg-transparent text-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:bg-gray-800 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-[hsl(var(--accent))]">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${currentImage === image.src ? 'border-accent' : 'border-gray-700'}`}
                  onClick={() => setCurrentImage(image.src)}
                >
                  <Image
                    src={image.src}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            {selectedColor && <p className="text-xl text-gray-400 mb-2">{selectedColor.name}</p>}
            <div className="flex items-baseline gap-4 mb-4">
              <p className="text-3xl text-accent font-semibold" style={{color: 'hsl(var(--accent))'}}>{product.price}</p>
            </div>

            <div className="prose prose-invert max-w-none mb-6">
              <p>{product.description}</p>
            </div>

            {/* Product Features */}
            {(product.feature1 || product.feature2 || product.feature3) && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-bold mb-3 text-gray-200">Características Adicionales</h3>
                    <ul className="space-y-2">
                        {product.feature1 && (
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{product.feature1}</span>
                            </li>
                        )}
                        {product.feature2 && (
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{product.feature2}</span>
                            </li>
                        )}
                        {product.feature3 && (
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{product.feature3}</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
            
            {product.category === 'ropa' && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span><span className="font-semibold">Tipo de tela:</span> {product.fabric_type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span><span className="font-semibold">Compresión:</span> {product.is_compression ? 'Sí' : 'No'}</span>
                </div>
              </div>
            )}

            {product.category === 'suplemento' && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-green-500" />
                  <span><span className="font-semibold">Beneficios:</span> {product.benefits}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-blue-500" />
                  <span><span className="font-semibold">Servicios:</span> {product.servings_info}</span>
                </div>
              </div>
            )}


            {/* Options */}
            <div className="mt-auto space-y-4">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">{product.category === 'suplemento' ? 'Sabor' : 'Color'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => {
                      const isColorSoldOut = color.options.values.every(v => v.stock === 0);
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <Button 
                            key={color.name} 
                            variant={isSelected ? 'destructive' : 'outline'}
                            onClick={() => !isColorSoldOut && handleColorClick(color)} 
                            disabled={isColorSoldOut} 
                            className={`relative ${isColorSoldOut ? 'bg-black text-gray-500' : ''}`}
                        >
                            {color.name}
                            {isColorSoldOut && <span className="sold-out-x">X</span>}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {currentOptions && !(currentOptions.values.length === 1 && currentOptions.values[0].value === 'Único') && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {currentOptions.type.charAt(0).toUpperCase() + currentOptions.type.slice(1)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentOptions.values.map((option) => {
                      const stock = getAvailableStock(option);
                      const isSelected = selectedOption?.value === option.value;
                      
                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? 'destructive' : 'outline'}
                          onClick={() => handleOptionClick(option)}
                          disabled={stock === 0}
                          className="relative"
                        >
                          {option.value}
                           {stock === 0 && <span className="sold-out-x">X</span>}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

                <p className="availability-message text-sm text-gray-400 h-5">
                  {availabilityMessage}
                </p>

                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                >
                  {isAddToCartDisabled && selectedOption ? 'Agotado' : 'AGREGAR AL CARRITO'}
                </Button>
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
