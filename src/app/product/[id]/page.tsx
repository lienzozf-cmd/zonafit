
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, ProductOption, ProductColor } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/stores/product-store';
import { Button } from '@/components/ui/button';
import { Check, Shield, ArrowLeft, Pill, Server } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';


const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { products: storeProducts } = useProductStore();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    const foundProduct = storeProducts.find((p) => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
        setCurrentImage(foundProduct.colors[0].imageSrc);
      } else {
        setCurrentImage(foundProduct.images[0].src);
      }
      
      if (foundProduct.options?.values.length === 1 && foundProduct.options.values[0].value === 'Único') {
          setSelectedOption(foundProduct.options.values[0]);
      }
    }
  }, [id, storeProducts]);

  useEffect(() => {
    if (selectedColor) {
      const updatedProduct = storeProducts.find(p => p.id === product?.id);
      const updatedColor = updatedProduct?.colors?.find(c => c.name === selectedColor.name);
      if (updatedColor) {
        setSelectedColor(updatedColor);
      }
    }
  }, [storeProducts, product, selectedColor]);
  
  useEffect(() => {
    if (selectedOption) {
      setAvailabilityMessage(`Disponible: ${selectedOption.stock} unidades`);
    } else if (selectedColor) {
      setAvailabilityMessage(`Selecciona un ${selectedColor.options.type}`);
    } else if (product?.options) {
      setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }
  }, [selectedOption, selectedColor, product]);

  const handleColorClick = (color: ProductColor) => {
    setSelectedColor(color);
    setCurrentImage(color.imageSrc);
    setSelectedOption(null); // Reset size selection
  };

  const handleOptionClick = (option: ProductOption) => {
    if (!product) return;
    setSelectedOption(option);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.colors && (!selectedColor || !selectedOption)) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona un color y una ${selectedColor?.options.type || 'opción'}.`,
            variant: 'destructive',
        });
        return;
    }

    if (!product.colors && !selectedOption) {
        toast({
            title: 'Error',
            description: `Por favor, selecciona una ${product.options?.type || 'opción'}.`,
            variant: 'destructive',
        });
        return;
    }

    if (selectedOption?.stock === 0) {
        toast({
          title: 'Error',
          description: `No hay stock disponible para esta selección.`,
          variant: 'destructive',
        });
        return;
      }

    const priceAsNumber = parseFloat(product.price.replace(/Q\.|\s/g, ''));
    const cartItemId = selectedColor ? `${product.id}-${selectedColor.name}-${selectedOption!.value}` : `${product.id}-default-${selectedOption!.value}`;
    const cartItemName = selectedColor ? `${product.name} - ${selectedColor.name}` : product.name;


    addItem({
      id: cartItemId,
      name: cartItemName,
      price: priceAsNumber,
      image: currentImage,
      option: selectedOption!.value,
      quantity: 1,
    });

    toast({
      title: 'Agregado al carrito',
      description: `${cartItemName} (${selectedOption!.value}) ha sido agregado a tu carrito.`,
    });
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="text-white text-center py-20">Cargando producto...</div>
        <Footer />
      </>
    );
  }

  const currentOptions = selectedColor ? selectedColor.options : product.options;

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
            <p className="text-2xl text-accent font-semibold mb-4" style={{color: 'hsl(var(--accent))'}}>{product.price}</p>

            <div className="prose prose-invert max-w-none mb-6">
              <p>{product.description}</p>
            </div>
            
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
              {product.colors && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                        <Button key={color.name} variant={selectedColor?.name === color.name ? 'destructive' : 'outline'} onClick={() => handleColorClick(color)}>
                            {color.name}
                        </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {currentOptions && !(currentOptions.values.length === 1 && currentOptions.values[0].value === 'Único') && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {currentOptions.type.charAt(0).toUpperCase() + currentOptions.type.slice(1)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentOptions.values.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedOption?.value === option.value ? 'destructive' : 'outline'}
                        onClick={() => handleOptionClick(option)}
                        disabled={option.stock <= 0}
                        className={`border-gray-600 ${selectedOption?.value === option.value ? '' : 'text-white hover:bg-gray-800'}`}
                      >
                        {option.value}
                      </Button>
                    ))}
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
                  disabled={selectedOption?.stock === 0}
                >
                  {selectedOption?.stock === 0 ? 'Agotado' : 'AGREGAR AL CARRITO'}
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
