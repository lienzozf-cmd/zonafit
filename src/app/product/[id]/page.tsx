'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import type { Product, ProductOption } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/stores/product-store';
import { Button } from '@/components/ui/button';
import { Check, Shield } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';


const ProductDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const { products: storeProducts, decreaseStock } = useProductStore();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    const foundProduct = storeProducts.find((p) => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setCurrentImage(foundProduct.images[0].src);
      if (foundProduct.options.values.length > 0) {
        setAvailabilityMessage(`Selecciona un ${foundProduct.options.type}`);
      }
    }
  }, [id, storeProducts]);

  useEffect(() => {
    if (product && selectedOption) {
      const updatedProduct = storeProducts.find(p => p.id === product.id);
      const updatedOption = updatedProduct?.options.values.find(v => v.value === selectedOption.value);
      if (updatedOption) {
        setAvailabilityMessage(`Disponible: ${updatedOption.stock} unidades`);
      }
    } else if (product) {
      setAvailabilityMessage(`Selecciona un ${product.options.type}`);
    }
  }, [selectedOption, storeProducts, product]);

  const handleOptionClick = (option: ProductOption) => {
    if (!product) return;
    setSelectedOption(option);
    const newImage = product.images.find(img => img.option === option.value);
    if (newImage) {
      setCurrentImage(newImage.src);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedOption) {
      toast({
        title: 'Error',
        description: `Por favor, selecciona un ${product?.options.type || 'opción'}.`,
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

  if (!product) {
    return <div className="text-white text-center py-20">Cargando producto...</div>;
  }

  return (
    <>
    <Header />
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-accent-color">
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
                  className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${currentImage === image.src ? 'border-red-500' : 'border-gray-700'}`}
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
            <p className="text-2xl text-red-500 font-semibold mb-4">{product.price}</p>

            <div className="prose prose-invert max-w-none mb-6">
              <p>{product.description}</p>
            </div>
            
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

            {/* Options */}
            <div className="mt-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    {product.options.type.charAt(0).toUpperCase() + product.options.type.slice(1)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.options.values.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedOption?.value === option.value ? 'destructive' : 'outline'}
                        onClick={() => handleOptionClick(option)}
                        disabled={option.stock <= 0}
                        className={`border-gray-600 ${selectedOption?.value === option.value ? 'bg-red-500 text-white' : 'text-white hover:bg-gray-800'}`}
                      >
                        {option.value}
                      </Button>
                    ))}
                  </div>
                </div>

                <p className="availability-message text-sm text-gray-400 h-5 mb-4">
                  {availabilityMessage}
                </p>

                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600 text-lg py-6"
                  onClick={handleAddToCart}
                  disabled={!selectedOption || selectedOption.stock <= 0}
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
