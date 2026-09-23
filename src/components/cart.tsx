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
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const itemCount = useCartStore((state) => state.itemCount);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getProductOption = useCartStore((state) => state.getProductOption);
  const router = useRouter();

  const triggerConfetti = () => {
    if (typeof window === 'undefined') return;

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
    setTimeout(() => {
      setIsCartOpen(false);
      router.push('/checkout');
    }, 2000);
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
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md bg-black border-l border-red-600/30 text-white shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <SheetHeader className="p-6 border-b border-zinc-900">
          <SheetTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="text-red-600">Carrito</span>
            <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
            </span>
          </SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-6">
                {items.map((item) => (
                  <div key={item.id} className="group relative flex gap-4 bg-zinc-900/20 p-3 rounded-xl border border-zinc-800/50 hover:border-red-600/30 transition-all">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        sizes="96px"
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold leading-tight line-clamp-2 pr-8 group-hover:text-red-500 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                          Talla: <span className="text-zinc-300">{item.option}</span>
                          {item.color && (
                            <>
                              <span className="mx-2 text-zinc-700">|</span>
                              Color: <span className="text-zinc-300">{item.color}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-zinc-900 rounded-full px-1 border border-zinc-800">
                          <button 
                            onClick={() => handleDecrement(item.id)} 
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-lg font-medium"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleIncrement(item.id)} 
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-lg font-medium"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-500">
                            Q{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-[10px] text-zinc-600">
                            Q{item.price.toFixed(2)} c/u
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-900/50 rounded-md hover:bg-red-500/10"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-zinc-950 border-t border-zinc-900 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Subtotal</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-red-600 tracking-tight">
                      Q{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-7 text-lg rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-95 group overflow-hidden relative"
                onClick={handleCheckout}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Finalizar Compra
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
              
              <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                Pago seguro garantizado
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full" />
              <div className="relative bg-zinc-900 p-8 rounded-full border border-zinc-800">
                <Trash className="h-12 w-12 text-zinc-700" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Tu carrito está vacío</h3>
              <p className="text-zinc-500 text-sm max-w-[200px]">
                ¡Agrega algunos productos para comenzar tu transformación!
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
              onClick={() => setIsCartOpen(false)}
            >
              Continuar Comprando
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
