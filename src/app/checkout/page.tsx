
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
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'El nombre es requerido.'),
  lastName: z.string().trim().min(1, 'El apellido es requerido.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(1, 'La dirección es requerida.'),
  department: z.string().trim().min(1, 'El departamento es requerido.'),
  municipality: z.string().trim().min(1, 'El municipio es requerido.'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

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

  async function onSubmit(data: CheckoutFormValues) {
    const orderDetails = {
      shippingInfo: data,
      orderItems: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        option: item.option,
        quantity: item.quantity,
      })),
      orderTotal: total,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el correo de notificación.');
      }
      
      toast({
        title: '¡Pedido realizado con éxito!',
        description: 'Gracias por tu compra. Nos pondremos en contacto contigo pronto.',
      });
      clearCart();
      router.push('/');

    } catch (error: any) {
      console.error('El envío de correo de notificación falló:', error);
      toast({
        title: 'Error al procesar el pedido',
        description: error.message || 'No se pudo enviar la notificación. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Información de Envío
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Resumen del Pedido</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.option} x {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">Q{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-700 pt-4">
                 <div className="flex justify-between text-lg font-bold">
                   <span>Total</span>
                   <span>Q{total.toFixed(2)}</span>
                 </div>
                 <div className="mt-4 p-4 bg-gray-900 border border-accent rounded-lg">
                    <p className="text-center text-accent-foreground">
                        <span className="font-bold">Nota sobre el envío:</span> Por favor, comunícate con nosotros a través de nuestras redes sociales para coordinar y calcular el costo de envío de tu pedido.
                    </p>
                 </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Detalles del Cliente</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} className="bg-gray-800 border-gray-600" />
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
                            <Input placeholder="Pérez" {...field} className="bg-gray-800 border-gray-600" />
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
                        <FormLabel>Número de teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} className="bg-gray-800 border-gray-600" />
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
                        <FormLabel>Dirección exacta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 1ra Calle, 2-3, Zona 4" {...field} className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departamento</FormLabel>
                            <FormControl>
                              <Input placeholder="Guatemala" {...field} className="bg-gray-800 border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="municipality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Municipio</FormLabel>
                            <FormControl>
                              <Input placeholder="Guatemala" {...field} className="bg-gray-800 border-gray-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                  <Button type="submit" variant="destructive" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
