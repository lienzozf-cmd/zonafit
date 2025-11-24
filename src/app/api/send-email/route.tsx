import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import nodemailer from 'nodemailer';
import { getNextOrderId } from '@/lib/inventory-manager';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const toEmail = process.env.EMAIL_TO || "rabanalesf22@gmail.com";
const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

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
  const orderId = await getNextOrderId();

  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
     console.warn('ADVERTENCIA: Las credenciales de correo no están configuradas en .env. El pedido se procesó, pero el correo de notificación no fue enviado.');
    return NextResponse.json({ message: 'Pedido procesado con éxito (notificación por correo deshabilitada).', orderId });
  }

  try {
    const body = await req.json();

    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Error de validación de Zod:', validationResult.error.flatten());
      return NextResponse.json({
        message: 'Datos del pedido inválidos.',
        errors: validationResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { shippingInfo, orderItems, orderTotal } = validationResult.data;

    const itemsWithSubtotal = orderItems.map(item => {
      const subtotal = item.price * item.quantity;
      return {
        ...item,
        subtotal: subtotal.toFixed(2),
      };
    });

    const emailHtml = render(OrderConfirmationEmail({ 
        orderDetails: {
          shippingInfo,
          orderItems: itemsWithSubtotal,
          orderTotal: orderTotal,
          orderId,
        }
    }));
    
    const mailOptions = {
        from: `ZONA FIT GT <${fromEmail}>`,
        to: toEmail,
        subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        html: emailHtml,
      };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Pedido procesado y correo enviado exitosamente', orderId });

  } catch (error: any) {
    console.error('Error catastrófico en el endpoint /api/send-email:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message, orderId }, { status: 500 });
  }
}
