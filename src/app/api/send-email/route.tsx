
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { products } from '@/lib/data';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

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

    // Server-side calculation of total
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
    
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // --- Email Sending ---
    const toEmail = "rabafam2118@gmail.com";
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('ADVERTENCIA: Las variables de entorno para el envío de correo no están definidas (EMAIL_USER o EMAIL_PASS). El correo de notificación no será enviado, pero el pedido se procesa como exitoso.');
      return NextResponse.json({ message: 'Pedido procesado con éxito.', orderId, warning: 'La notificación por correo no se pudo enviar por falta de configuración en el servidor.' });
    }

    const emailHtml = render(
      <OrderConfirmationEmail
        orderDetails={{
          shippingInfo,
          orderItems: itemsWithSubtotal,
          orderTotal: serverCalculatedTotal,
        }}
      />
    );
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ZONA FIT GT" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
      html: emailHtml,
    };
    
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: 'Pedido procesado y correo enviado exitosamente', orderId });
    } catch (error: any) {
      console.error('Error al intentar enviar el correo:', error);
      
      const errorMessage = error.code === 'EAUTH'
        ? 'Error de autenticación con el servidor de correo. Revisa las credenciales.'
        : `Error al enviar el correo: ${error.message}`;

      // EVEN IF THE EMAIL FAILS, CONSIDER THE ORDER SUCCESSFUL FOR THE CLIENT
      return NextResponse.json({ message: 'Pedido procesado con éxito.', orderId, warning: `El pedido se guardó, pero la notificación por correo falló: ${errorMessage}` });
    }

  } catch (error: any) {
    console.error('Error en el endpoint /api/send-email:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
