
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { Resend } from 'resend';
import * as React from 'react';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import { products } from '@/lib/data';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const toEmail = "rabanalesf22@gmail.com";
const fromEmail = 'onboarding@resend.dev';


const cartItemSchema = z.object({
  id: z.string(),
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  color: z.string().optional().nullable(),
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
  orderTotal: z.number(),
});

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://zona-fit-gt-online.web.app";

    const isAllowed = (origin && origin === allowedOrigin) || (referer && referer?.startsWith(allowedOrigin + '/'));
     if (!isAllowed) {
        return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 403 });
    }
  }
  
  let payload;
  try {
      payload = await req.json();
  } catch {
      return NextResponse.json({ error: 'Solicitud malformada.' }, { status: 400 });
  }
  
  const validationResult = orderSchema.safeParse(payload);
  
  if (!validationResult.success) {
    console.error('Error de validación de Zod:', validationResult.error.flatten());
    return NextResponse.json({
      message: 'Datos del pedido inválidos.',
      errors: validationResult.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const { shippingInfo, orderItems: clientItems } = validationResult.data;
  
  const orderId = await getNextOrderId();

  if (!resend) {
    console.warn('ADVERTENCIA: La RESEND_API_KEY no está configurada en .env. El pedido se procesó, pero el correo de notificación no fue enviado.');
    return NextResponse.json({ message: 'Pedido procesado con éxito (notificación por correo deshabilitada).', orderId });
  }

  try {
    let serverCalculatedTotal = 0;
    const validatedItems = [];

    for (const item of clientItems) {
      const product = products.find(p => p.id === item.productId);

      if (!product) {
        throw new Error(`Producto no encontrado con ID: ${item.productId}`);
      }

      const price = parseFloat(product.price.replace(/Q|\s/g, ''));
      
      if (price !== item.price) {
           console.warn(`Price mismatch for ${product.name}. Client: ${item.price}, Server: ${price}. Using server price.`);
      }
      
      await updateStock(item.productId, item.option, item.quantity, item.color ?? undefined);

      serverCalculatedTotal += price * item.quantity;
      validatedItems.push({ 
        ...item, 
        price, 
        name: item.name, 
        subtotal: (price * item.quantity).toFixed(2),
      });
    }


    const { data, error } = await resend.emails.send({
        from: `ZONA FIT GT <${fromEmail}>`,
        to: [toEmail],
        subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        react: OrderConfirmationEmail({ 
            orderDetails: {
              shippingInfo,
              orderItems: validatedItems,
              orderTotal: serverCalculatedTotal,
              orderId,
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
