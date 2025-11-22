
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { products } from '@/lib/data';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { Resend } from 'resend';
import * as React from 'react';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const toEmail = "rabafam2118@gmail.com";
const fromEmail = 'onboarding@resend.dev';


const cartItemSchema = z.object({
  id: z.string(),
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  color: z.string().optional(),
  quantity: z.number().min(1),
});

const shippingInfoSchema = z.object({
  firstName: z.string().trim().min(1, 'El nombre es requerido.'),
  lastName: z.string().trim().min(1, 'El apellido es requerido.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(1, 'La dirección es requerida.'),
  department: z.string().trim().min(1, 'El departamento es requerido.'),
  municipality: z.string().trim().min(1, 'El municipio es requerido.'),
});

const orderSchema = z.object({
  shippingInfo: shippingInfoSchema,
  orderItems: z.array(cartItemSchema).min(1, 'El carrito no puede estar vacío.'),
});

export async function POST(req: NextRequest) {
  const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  try {
    const body = await req.json();

    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        message: 'Datos del pedido inválidos.',
        errors: validationResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { shippingInfo, orderItems } = validationResult.data;

    let serverCalculatedTotal = 0;
    const itemsWithSubtotal = orderItems.map(item => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado.`);
      }
      const priceAsNumber = parseFloat(product.price.replace(/Q\.?|\s/g, ''));
      const subtotal = priceAsNumber * item.quantity;
      serverCalculatedTotal += subtotal;
      return {
        ...item,
        price: priceAsNumber,
        subtotal: subtotal.toFixed(2),
      };
    });

    serverCalculatedTotal = parseFloat(serverCalculatedTotal.toFixed(2));
    
    if (!resend) {
      console.warn('ADVERTENCIA: La RESEND_API_KEY no está configurada en .env. El pedido se procesó, pero el correo de notificación no fue enviado.');
      return NextResponse.json({ message: 'Pedido procesado con éxito (notificación por correo deshabilitada).', orderId });
    }
    
    const { data, error } = await resend.emails.send({
        from: `ZONA FIT GT <${fromEmail}>`,
        to: [toEmail],
        subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        react: OrderConfirmationEmail({ 
            orderDetails: {
              shippingInfo,
              orderItems: itemsWithSubtotal,
              orderTotal: serverCalculatedTotal,
            }
        }) as React.ReactElement,
      });

      if (error) {
        console.error('Error al enviar correo con Resend:', error);
        return NextResponse.json({ message: 'Pedido procesado con éxito, pero la notificación por correo falló.', orderId, warning: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Pedido procesado y correo enviado exitosamente', orderId, data });

  } catch (error: any) {
    console.error('Error catastrófico en el endpoint /api/send-email:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message, orderId }, { status: 500 });
  }
}
