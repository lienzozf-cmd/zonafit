'use client';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';

const Cart = () => {
  const { 
    items, 
    total, 
    itemCount, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    incrementQuantity, 
    decrementQuantity,
    getProductOption
  } = useCartStore((state) => state);
  const router = useRouter();

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = window.setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleCheckout = () => {
    triggerConfetti();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  }

  const handleIncrement = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
        const option = getProductOption(item.productId, item.option, item.color);
        if (option && item.quantity < option.stock) {
            incrementQuantity(id);
        } else if (option && option.stock > 0 && item.quantity >= option.stock) {
            // This case is tricky without a toast here. Silently fail.
             console.log('No hay más stock para este producto.');
        } else {
            incrementQuantity(id);
        }
    }
  };

  const handleDecrement = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
        if (item.quantity > 1) {
            decrementQuantity(id);
        } else {
            handleRemoveItem(id);
        }
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-black text-white">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-white">Tu Carrito ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-5 pr-6">
                {items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex justify-between space-x-4">
                      <div className="flex flex-1 space-x-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fill
                            className="absolute object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1 self-start">
                          <span className="line-clamp-2 text-sm font-medium">{item.name}</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            Talla: {item.option}
                          </span>
                          <span className="line-clamp-1 text-sm font-medium">
                            Q{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex items-center gap-2">
                           <div className="flex items-center cart-item-quantity-control">
                            <button onClick={() => handleDecrement(item.id)} className="text-black">-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleIncrement(item.id)} className="text-black">+</button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pr-6">
              <div className="space-y-1.5 text-sm">
                <div className="flex text-base font-medium">
                  <span className="flex-1">Total</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
              </div>
              <SheetFooter>
                <Button variant="destructive" className="w-full" onClick={handleCheckout}>
                  Finalizar Compra
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="text-xl font-medium">Tu carrito está vacío</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
