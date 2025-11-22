
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { products } from '@/lib/data';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const validationResult = orderSchema.safeParse(req.body.orderItems ? { shippingInfo: req.body.shippingInfo, orderItems: req.body.orderItems } : req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Datos del pedido inválidos.',
      errors: validationResult.error.flatten().fieldErrors,
    });
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
  
  const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();

  // --- Envío de correo ---
  const toEmail = "rabafam2118@gmail.com";
  
  // VERIFICACIÓN DE CREDENCIALES
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ADVERTENCIA: Las variables de entorno para el envío de correo no están definidas (EMAIL_USER o EMAIL_PASS). El correo de notificación no será enviado, pero el pedido se procesa como exitoso.');
    // Responde con éxito para no bloquear el flujo del cliente, pero con una advertencia.
    return res.status(200).json({ message: 'Pedido procesado con éxito.', orderId, warning: 'La notificación por correo no se pudo enviar por falta de configuración en el servidor.' });
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
    res.status(200).json({ message: 'Pedido procesado y correo enviado exitosamente', orderId });
  } catch (error: any) {
    console.error('Error al intentar enviar el correo:', error);
    
    const errorMessage = error.code === 'EAUTH'
      ? 'Error de autenticación con el servidor de correo. Revisa las credenciales.'
      : `Error al enviar el correo: ${error.message}`;

    // AUNQUE EL CORREO FALLE, EL PEDIDO SE CONSIDERA EXITOSO PARA EL CLIENTE
    res.status(200).json({ message: 'Pedido procesado con éxito.', orderId, warning: `El pedido se guardó, pero la notificación por correo falló: ${errorMessage}` });
  }
}
