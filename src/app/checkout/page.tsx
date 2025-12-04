
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, Send, Truck, WalletCards } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(5, 'La dirección debe ser más detallada.'),
  department: z.string().trim().min(3, 'El departamento es requerido.'),
  municipality: z.string().trim().min(3, 'El municipio es requerido.'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, total, processOrder, clearCart } = useCartStore((state) => ({
    items: state.items,
    total: state.total,
    processOrder: state.processOrder,
    clearCart: state.clearCart,
  }));
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingCost = 35;
  const orderTotal = total + shippingCost;
  const isCartEmpty = items.length === 0;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      department: '',
      municipality: '',
    },
  });

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

  async function onSubmit(data: CheckoutFormValues) {
    if (isCartEmpty) return;
    setIsLoading(true);

    const orderDetails = { shippingInfo: data, orderItems: items, orderTotal: orderTotal };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.message || 'Algo salió mal al procesar el pedido.';
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            const field = key as keyof CheckoutFormValues;
            const message = result.errors[field]?.[0];
            if (message) form.setError(field, { type: 'server', message });
          });
        }
        throw new Error(errorMsg);
      }

      triggerConfetti();
      setIsSubmitSuccessful(true);
      setOrderId(result.orderId);
      processOrder();
      form.reset();
    } catch (error: any) {
      console.error('Error en el proceso de checkout:', error);
      toast({
        title: 'Error al enviar pedido',
        description: error.message || 'No se pudo completar el pedido. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitSuccessful && orderId) {
    return (
      <>
        <Header />
        <main className="bg-transparent text-white">
          <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <CheckCircle className="success-checkmark" />
            <h1 className="mt-4 text-3xl font-bold text-red-500">¡Gracias por tu compra!</h1>
            <p className="mt-2 text-gray-300 max-w-md">
              Tu pedido ha sido procesado con éxito. Nos pondremos en contacto contigo pronto para coordinar el envío.
            </p>
            <div className="mt-8 bg-gray-900/80 p-6 rounded-lg border border-gray-700 w-full max-w-sm">
              <p className="text-gray-400">Tu número de orden es:</p>
              <p className="text-4xl font-bold tracking-widest text-white mt-2">{orderId}</p>
              <p className="text-xs text-gray-500 mt-4">¡Tómale una captura de pantalla como referencia!</p>
            </div>
            <Button asChild variant="secondary" className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/marcas">Seguir Comprando</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  if (isCartEmpty) {
    return (
      <>
        <Header />
        <main className="bg-transparent text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-500" />
            <h1 className="mt-4 text-2xl font-bold">Tu carrito está vacío</h1>
            <p className="mt-2 text-gray-400">
              Parece que no has añadido ningún producto a tu carrito todavía.
            </p>
            <Button asChild variant="destructive" className="mt-6">
              <Link href="/marcas">Explorar productos</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-black text-white flex justify-center py-12">
        <div className="w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Información de Envío</h2>
              <p className="text-sm text-gray-400 mb-8">Introduce tus datos para el pago contra entrega.</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu apellido" {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 12345678" {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección Exacta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Calle, avenida, no. de casa, etc." {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipio</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu municipio" {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu departamento" {...field} className="bg-[#1C2033] border-slate-700 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full text-base font-semibold py-6 bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 rounded-lg" disabled={isLoading || isCartEmpty}>
                    {isLoading ? 'Procesando...' : <><Send size={20} /> Enviar Pedido</>}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="bg-[#1C2033] p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Resumen de tu Pedido</h2>
              <div className="space-y-4">
                  {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
                      <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                      </div>
                      </div>
                      <p className="font-semibold">Q{typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
                  </div>
                  ))}
              </div>
              <div className="mt-6 border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-base">
                    <span>Subtotal</span>
                    <span>Q{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Envío</span>
                    <span>Q{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-600 mt-2">
                    <span>Total del Pedido</span>
                    <span>Q{orderTotal.toFixed(2)}</span>
                  </div>
              </div>
              <div className="mt-6 space-y-4">
                  <div className="p-4 bg-black/30 border border-white/10 rounded-lg flex items-start gap-3">
                      <Truck size={32} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                          <h3 className="font-semibold">Nota sobre el envío</h3>
                          <p className="text-sm text-gray-400">
                              Su envío tendrá un valor de Q.35 a cualquier parte del país.
                          </p>
                      </div>
                  </div>
                  <div className="p-4 bg-black/30 border border-white/10 rounded-lg flex items-start gap-3">
                      <WalletCards size={32} className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                          <h3 className="font-semibold">Nota sobre el pago</h3>
                          <p className="text-sm text-gray-400">
                          El método de pago principal es PREVIO DEPÓSITO a la siguiente cuenta: Banco Industrial, 00000, Carlos Rabanales. Por favor, envíanos el comprobante a nuestras redes sociales para confirmar tu pedido.
                          </p>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
