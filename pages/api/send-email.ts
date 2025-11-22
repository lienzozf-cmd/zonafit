import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { products } from '@/lib/data';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import nodemailer from 'nodemailer';

// --- Esquemas de validación con Zod ---
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

// --- Contador de pedidos ---
let orderCounter = 0;
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

async function readCounter() {
  try {
    const data = await fs.readFile(counterFilePath, 'utf-8');
    orderCounter = parseInt(data, 10) || 0;
  } catch (error) {
    orderCounter = 0;
  }
}

async function writeCounter() {
  await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
}

readCounter(); // Leer el contador al iniciar

// --- Handler de la API ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verificación de Método y Seguridad
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Verificación de Referer para seguridad básica
  const referer = req.headers.referer;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    console.error('NEXT_PUBLIC_APP_URL no está definido en las variables de entorno.');
    return res.status(500).json({ message: 'Configuración del servidor incompleta.' });
  }

  if (!referer || !referer.startsWith(appUrl)) {
    return res.status(403).json({ message: 'Origen de la solicitud no válido.' });
  }


  // 2. Validación de Datos con Zod
  const validationResult = orderSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Datos del pedido inválidos.',
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  const { shippingInfo, orderItems } = validationResult.data;

  // 3. Cálculo del Total en el Servidor
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
  
  // Formatear el total a dos decimales
  serverCalculatedTotal = parseFloat(serverCalculatedTotal.toFixed(2));

  // 4. Incrementar número de pedido y guardar
  orderCounter++;
  const orderId = orderCounter.toString().padStart(6, '0');
  await writeCounter();

  const emailHtml = render(
    <OrderConfirmationEmail
      orderDetails={{
        shippingInfo,
        orderItems: itemsWithSubtotal,
        orderTotal: serverCalculatedTotal,
      }}
    />
  );

  // 5. Configurar Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const toEmail = process.env.EMAIL_RECIPIENT;
  if (!toEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Las variables de entorno para el envío de correo no están definidas.');
    return res.status(500).json({ message: 'La configuración del servidor de correo está incompleta.' });
  }

  const mailOptions = {
    from: `"ZONA FIT GT" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
    html: emailHtml,
  };

  // 6. Enviar Correo con Nodemailer
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente', orderId });
  } catch (error: any) {
    console.error('Error al enviar el correo:', error);
    // Devuelve un error más específico para el cliente
    const errorMessage = error.code === 'EAUTH'
      ? 'Error de autenticación con el servidor de correo. Revisa las credenciales.'
      : `Error al enviar el correo: ${error.message}`;
    res.status(500).json({ message: errorMessage });
  }
}
