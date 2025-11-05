
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
import { sendOrderEmail } from '@/ai/flows/send-order-email-flow';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(50, 'El nombre no puede exceder los 50 caracteres.'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.').max(50, 'El apellido no puede exceder los 50 caracteres.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().min(5, 'La dirección es requerida.').max(200, 'La dirección no puede exceder los 200 caracteres.'),
  department: z.string().min(3, 'El departamento es requerido.').max(50, 'El departamento no puede exceder los 50 caracteres.'),
  municipality: z.string().min(3, 'El municipio es requerido.').max(50, 'El municipio no puede exceder los 50 caracteres.'),
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
      orderItems: items,
      orderTotal: total,
    };

    console.log('Datos del pedido:', orderDetails);

    try {
      // Intenta enviar el correo, pero no detengas el flujo si falla.
      await sendOrderEmail(orderDetails);
    } catch (error) {
      // El error ya se registra en el servidor, aquí no hacemos nada para no alarmar al cliente.
      console.error('El envío de correo de notificación falló, pero el pedido fue procesado:', error);
    }

    // El resto del proceso continúa sin importar el resultado del envío de correo.
    toast({
        title: '¡Pedido realizado con éxito!',
        description: 'Gracias por tu compra. Nos pondremos en contacto contigo pronto.',
    });
    clearCart();
    router.push('/');
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
