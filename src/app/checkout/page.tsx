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
import Footer from '@/components/footer';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';
import {
  ShoppingCart,
  CheckCircle,
  Send,
  Truck,
  WalletCards,
  CreditCard,
  Copy,
  Check,
  Lock,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Navigation,
  Loader2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Product } from '@/lib/data';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  email: z.string().email('Por favor, introduce un correo electrónico válido.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(5, 'La dirección debe ser más detallada.'),
  department: z.string().trim().min(3, 'El departamento es requerido.'),
  municipality: z.string().trim().min(3, 'El municipio es requerido.'),
  paymentMethod: z.enum(['deposit', 'cod'], { required_error: 'Debes seleccionar un método de pago.' }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const processOrder = useCartStore((state) => state.processOrder);
  const products = useCartStore((state) => state.products);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      municipality: '',
      paymentMethod: 'deposit',
    },
  });

  const paymentMethod = form.watch('paymentMethod');
  const shippingCost = 35;
  const codCommissionPercentage = 0.04; // 4%

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const totalAfterDiscount = subtotal; 
  const codCommission = paymentMethod === 'cod' ? totalAfterDiscount * codCommissionPercentage : 0;
  const orderTotal = totalAfterDiscount + shippingCost + codCommission;
  const isCartEmpty = items.length === 0;

  useEffect(() => {
    // Tracking conversion when order is successful
    if (isSubmitSuccessful && orderId) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-17970036779/UNe2CN3ZnP0bEKuA5PhC',
          'value': orderTotal,
          'currency': 'GTQ',
          'transaction_id': orderId
        });
      }
    }
  }, [isSubmitSuccessful, orderId, orderTotal]);

  const copyAccountNumber = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const accountNumber = '5600015308';
    
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accountNumber).catch(() => {
          fallbackCopyText(accountNumber);
        });
      } else {
        fallbackCopyText(accountNumber);
      }
    } catch (err) {
      fallbackCopyText(accountNumber);
    }

    setCopiedAccount(true);
    toast({
      title: '¡Número de cuenta copiado!',
      description: `${accountNumber} copiado al portapapeles.`,
    });
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const fallbackCopyText = (text: string) => {
    if (typeof document === 'undefined') return;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Fallback copy error:', err);
    }
    document.body.removeChild(textArea);
  };

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

    const orderDetails = {
      shippingInfo: data,
      orderItems: items,
      orderSubtotal: subtotal,
      orderDiscount: 0, 
      orderShipping: shippingCost,
      orderCommission: codCommission,
      orderTotal: orderTotal,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        let errorMsg = 'Algo salió mal al procesar el pedido.';
        try {
          const result = await response.json();
          errorMsg = result.message || `Error inesperado del servidor.`;
          if (result.errors) {
            Object.keys(result.errors).forEach((key) => {
              const field = key as keyof CheckoutFormValues;
              const message = result.errors[field]?.[0];
              if (message) form.setError(field, { type: 'server', message });
            });
          }
        } catch (e) {
          errorMsg = 'Error inesperado del servidor. Por favor, intenta de nuevo.';
        }
        throw new Error(errorMsg);
      }
      
      const result = await response.json();
      
      triggerConfetti();
      
      setIsSubmitSuccessful(true);
      setOrderId(result.orderId);
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
    const handleContinueShopping = () => {
      processOrder();
      router.push('/marcas');
    };

    return (
      <>
        <Header />
        <main className="bg-black text-white min-h-screen">
          <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">¡Gracias por tu compra!</h1>
            <p className="mt-3 text-zinc-400 max-w-md text-base leading-relaxed">
              Tu pedido ha sido procesado con éxito. Nos pondremos en contacto contigo pronto para coordinar el envío.
            </p>
            <div className="mt-8 bg-zinc-950 p-8 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Tu número de orden es:</p>
              <p className="text-4xl sm:text-5xl font-black tracking-widest text-red-500 mt-2 font-mono drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">{orderId}</p>
              <p className="text-xs text-zinc-400 mt-4 font-medium flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                ¡Tómale una captura de pantalla como referencia!
              </p>
            </div>
            <Button onClick={handleContinueShopping} className="mt-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black px-8 py-6 rounded-xl shadow-lg uppercase tracking-wider text-sm">
              Seguir Comprando
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isCartEmpty && !isSubmitSuccessful) {
    return (
      <>
        <Header />
        <main className="bg-black text-white min-h-screen">
          <div className="container mx-auto px-4 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-6">
              <ShoppingCart className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">Tu carrito está vacío</h1>
            <p className="mt-3 text-zinc-400 max-w-md mx-auto text-sm sm:text-base">
              Parece que no has añadido ningún producto a tu carrito todavía. Explora nuestras marcas y catálogo exclusivo.
            </p>
            <Button asChild className="mt-8 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-6 rounded-xl uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Link href="/marcas">Explorar Productos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#050505] text-white py-8 md:py-12 min-h-screen relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 relative z-10">

          {/* Checkout 3-Step Progress Indicator */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800 z-0" />
              <div className="absolute left-0 w-1/2 top-1/2 -translate-y-1/2 h-0.5 bg-red-600 z-0 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                  <Check className="w-4 h-4 stroke-[3px]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mt-2">Carrito</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse">
                  2
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-wider mt-2">Envío y Pago</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-xs">
                  3
                </div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-2">Confirmación</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Shipping & Payment Form */}
            <div className="lg:col-span-7 bg-zinc-950/90 p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-6">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Truck className="w-6 h-6 text-red-500" />
                    Información de Envío
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Introduce tus datos de entrega en Guatemala para procesar tu orden.</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Nombre</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                              <Input placeholder="Tu nombre" {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Apellido</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                              <Input placeholder="Tu apellido" {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Correo Electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <Input placeholder="tu@correo.com" {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Número de Teléfono / WhatsApp</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <Input placeholder="Ej: 37331442 (8 dígitos)" {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all font-mono" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Dirección Exacta de Entrega</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <Input placeholder="Ej: Calle, avenida, zona, número de casa, colonia..." {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Municipio</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                              <Input placeholder="Ej: Guatemala, Mixco..." {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Departamento</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                              <Input placeholder="Ej: Guatemala, Quetzaltenango..." {...field} className="bg-zinc-900/90 border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 rounded-xl pl-10 text-white placeholder:text-zinc-600 h-11 transition-all" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3 pt-3">
                        <FormLabel className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
                          <span>Selecciona Método de Pago</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Paso Requerido</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            {/* Option 1: Deposit */}
                            <label
                              htmlFor="payment-deposit"
                              className={`flex items-start justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                field.value === 'deposit'
                                  ? 'bg-red-950/20 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <RadioGroupItem value="deposit" id="payment-deposit" className="mt-1 border-zinc-600 text-red-600" />
                                <div>
                                  <div className="font-black text-sm text-white flex items-center gap-2">
                                    <WalletCards className="w-4 h-4 text-red-500" />
                                    Previo Depósito / Transferencia
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-0.5">
                                    Banco Industrial (Transferencia en línea o depósito bancario directo)
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                                Sin Comisión
                              </span>
                            </label>

                            {/* Option 2: COD */}
                            <label
                              htmlFor="payment-cod"
                              className={`flex items-start justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                field.value === 'cod'
                                  ? 'bg-red-950/20 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <RadioGroupItem value="cod" id="payment-cod" className="mt-1 border-zinc-600 text-red-600" />
                                <div>
                                  <div className="font-black text-sm text-white flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-amber-500" />
                                    Pago Contra Entrega en Efectivo
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-0.5">
                                    Pagas en efectivo al repartidor de Forza al recibir tu paquete
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                                +4% Comisión Forza
                              </span>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button with Loading Spinner State */}
                  <Button
                    type="submit"
                    disabled={isLoading || isCartEmpty}
                    className="relative group w-full text-base font-black py-6 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white hover:from-red-500 hover:to-red-600 flex items-center justify-center gap-2.5 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.55)] border border-red-500/40 transition-all duration-300 active:scale-[0.99] overflow-hidden"
                  >
                    {/* Shimmer beam */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                    {isLoading ? (
                      <span className="flex items-center gap-2 text-white">
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span>Procesando Pedido Seguro...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 tracking-wider uppercase">
                        <Send className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        <span>Enviar Pedido Ahora</span>
                      </span>
                    )}
                  </Button>

                  {/* Trust badges footer */}
                  <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg border border-zinc-800/60">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Compra 100% Garantizada</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg border border-zinc-800/60">
                      <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Datos Cifrados y Seguros</span>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* Right Column: Order Summary & Interactive Banking Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-950/90 p-6 sm:p-7 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-xl">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-5 flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span>Resumen de tu Pedido</span>
                  <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'Producto' : 'Productos'}
                  </span>
                </h2>

                {/* Items List */}
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0 bg-black">
                          <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                            {item.color && <span>{item.color}</span>}
                            {item.option && <span>• Talla: {item.option}</span>}
                            <span>• Cant: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <p className="font-black text-sm text-white font-mono">Q{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="mt-6 border-t border-zinc-800 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white font-mono">Q{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-red-500" />
                      Envío a Todo el País
                    </span>
                    <span className="font-bold text-white font-mono">Q{shippingCost.toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      <span>Comisión Forza (4%)</span>
                      <span className="font-bold font-mono">Q{codCommission.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline text-lg font-black pt-3 border-t border-zinc-800 mt-2">
                    <span className="text-white uppercase tracking-wider">Total a Pagar</span>
                    <span className="text-2xl text-red-500 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                      Q{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Payment & Shipping Info Cards */}
              <div className="space-y-4">
                {paymentMethod === 'deposit' ? (
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-2">
                        <WalletCards className="w-5 h-5 text-red-500" />
                        <h3 className="font-black text-sm text-white uppercase tracking-wider">Datos para Transferencia</h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                        Banco Industrial
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                      Haz tu transferencia o depósito y envíanos el comprobante por WhatsApp o Instagram para despachar tu paquete:
                    </p>

                    {/* Account card with instant Copy Button */}
                    <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-700/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Número de Cuenta Monetaria</span>
                          <span className="text-xl font-black text-white font-mono tracking-wider">5600015308</span>
                        </div>
                        <button
                          type="button"
                          onClick={copyAccountNumber}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold transition-all active:scale-95 shadow-md"
                        >
                          {copiedAccount ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
                              <span className="text-emerald-400">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-300">
                        <span className="text-zinc-500 font-medium">A nombre de:</span> <strong className="text-white font-bold">Carlos Rabanales</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-amber-500" />
                      <h3 className="font-black text-sm text-white uppercase tracking-wider">Pago Contra Entrega en Efectivo</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Pagarás el monto exacto de <strong className="text-white font-mono">Q{orderTotal.toFixed(2)}</strong> en efectivo directamente al repartidor de Forza cuando entregue tu pedido en tu dirección.
                    </p>
                  </div>
                )}

                {/* Shipping info banner */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Envíos Rápidos en Toda Guatemala</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Tarifa plana de Q35.00 con número de guía rastreable en tiempo real.</div>
                  </div>
                </div>
              </div>

              {/* Invisible admin checkout bypass */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isLoading) return;

                    form.setValue('firstName', 'admin');
                    form.setValue('lastName', 'admin');
                    form.setValue('email', 'admin@admin.com');
                    form.setValue('phone', '88888888');
                    form.setValue('address', 'admin admin');
                    form.setValue('department', 'admin');
                    form.setValue('municipality', 'admin');
                    form.setValue('paymentMethod', 'deposit');
                    
                    await form.handleSubmit(onSubmit)();
                  }}
                  className="w-5 h-5 rounded-full opacity-0 cursor-default focus:outline-none"
                  aria-hidden="true"
                />
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
