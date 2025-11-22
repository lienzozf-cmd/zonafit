import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { products } from '@/lib/data';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { render } from '@react-email/render';

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

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);


// --- Handler de la API ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verificación de Método
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
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


  // 5. Preparar y Enviar Correo con Resend
  const toEmail = process.env.EMAIL_RECIPIENT;
  if (!toEmail) {
    console.error('La variable de entorno EMAIL_RECIPIENT no está definida.');
    return res.status(500).json({ message: 'La configuración del servidor de correo está incompleta.' });
  }

  try {
    const { data, error } = await resend.emails.send({
        from: `ZONA FIT GT <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: [toEmail],
        subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        html: emailHtml,
    });

    if (error) {
        throw new Error('Error al enviar el correo desde Resend', { cause: error });
    }
    
    res.status(200).json({ message: 'Correo enviado exitosamente', orderId });
  } catch (error: any) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: `Error al enviar el correo: ${error.message}` });
  }
}
