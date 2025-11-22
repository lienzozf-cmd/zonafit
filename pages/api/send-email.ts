
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { products } from '@/lib/data';
import { URL } from 'url';

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

// --- Generador de HTML para el correo ---
const generateEmailHtml = (details: any, orderId: string) => {
    const { shippingInfo, orderItems, orderTotal } = details;
    const itemsHtml = orderItems
      .map(
        (item: any, index: number) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; display: flex; align-items: center;">
          <img src="cid:image-${index}" alt="${item.name}" width="60" style="border-radius: 8px; margin-right: 15px;" />
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.option}</small>
          </div>
        </td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">Q${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">Q${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h1 style="color: #E50000; text-align: center;">¡Nuevo Pedido #${orderId} en ZONA FIT GT!</h1>
        <p>Has recibido un nuevo pedido. Aquí están los detalles:</p>
        
        <h2 style="color: #333; border-bottom: 2px solid #E50000; padding-bottom: 5px;">Información del Cliente</h2>
        <p><strong>Nombre:</strong> ${shippingInfo.firstName} ${shippingInfo.lastName}</p>
        <p><strong>Teléfono:</strong> ${shippingInfo.phone}</p>
        <p><strong>Dirección:</strong> ${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.department}</p>
  
        <h2 style="color: #333; border-bottom: 2px solid #E50000; padding-bottom: 5px;">Detalles del Pedido</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cantidad</th>
              <th style="padding: 10px; text-align: right;">Precio Unit.</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
  
        <div style="text-align: right; margin-top: 20px; font-size: 1.5em; font-weight: bold;">
          <p>Total del Pedido: <span style="color: #E50000;">Q${orderTotal.toFixed(2)}</span></p>
        </div>
  
         <p style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #E50000;">
          <strong>Recordatorio:</strong> Debes contactar al cliente para coordinar el costo y la logística del envío.
        </p>
      </div>
    `;
};

// --- Handler de la API ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verificación de Método y Origen
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const referer = req.headers.referer;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl || !referer) {
      return res.status(403).json({ message: 'Origen de la solicitud no válido.' });
  }

  try {
      const refererOrigin = new URL(referer).origin;
      const appOrigin = new URL(appUrl).origin;

      if (refererOrigin !== appOrigin) {
          return res.status(403).json({ message: 'Origen de la solicitud no válido.' });
      }
  } catch (error) {
      return res.status(400).json({ message: 'URL de origen o aplicación no válida.' });
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
  for (const item of orderItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado.` });
    }
    const priceAsNumber = parseFloat(product.price.replace(/Q\.?|\s/g, ''));
    serverCalculatedTotal += priceAsNumber * item.quantity;
  }
  
  // Formatear el total a dos decimales
  serverCalculatedTotal = parseFloat(serverCalculatedTotal.toFixed(2));

  // 4. Incrementar número de pedido y guardar
  orderCounter++;
  const orderId = orderCounter.toString().padStart(6, '0');
  await writeCounter();

  // 5. Configuración de Nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 6. Preparar y Enviar Correo
  const attachments = await Promise.all(
    orderItems.map(async (item: any, index: number) => {
      const imagePath = path.join(process.cwd(), 'public', item.image);
      try {
        const fileContent = await fs.readFile(imagePath);
        return {
          filename: path.basename(item.image),
          content: fileContent,
          cid: `image-${index}`,
        };
      } catch (error) {
        console.error(`No se pudo leer el archivo de imagen: ${imagePath}`, error);
        return null;
      }
    })
  );
  
  const validAttachments = attachments.filter(Boolean) as any[];

  const mailOptions = {
    from: `ZONA FIT GT <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT,
    subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
    html: generateEmailHtml({ shippingInfo, orderItems, orderTotal: serverCalculatedTotal }, orderId),
    attachments: validAttachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente', orderId });
  } catch (error: any) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: `Error al enviar el correo: ${error.message}` });
  }
}
