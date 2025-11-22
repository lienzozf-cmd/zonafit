
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

// Variable para mantener el contador de pedidos en memoria
let orderCounter = 0;
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

// Función para leer el contador desde un archivo
async function readCounter() {
  try {
    const data = await fs.readFile(counterFilePath, 'utf-8');
    const count = parseInt(data, 10);
    orderCounter = isNaN(count) ? 0 : count;
  } catch (error) {
    // Si el archivo no existe, iniciamos en 0
    orderCounter = 0;
  }
}

// Función para escribir el contador en un archivo
async function writeCounter() {
  await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
}

// Leemos el contador al iniciar el servidor
readCounter();

// Helper to generate HTML for the email
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Incrementar y formatear el número de pedido
  orderCounter++;
  const orderId = orderCounter.toString().padStart(6, '0');
  await writeCounter(); // Guardar el nuevo valor

  const { shippingInfo, orderItems, orderTotal } = req.body;

  if (!shippingInfo || !orderItems || !orderTotal) {
    return res.status(400).json({ message: 'Missing order details' });
  }
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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
        console.error(`Could not read image file: ${imagePath}`, error);
        return null; // Return null if image can't be read
      }
    })
  );

  const validAttachments = attachments.filter(Boolean) as any[];

  const mailOptions = {
    from: `ZONA FIT GT <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT, // Correo de notificación
    subject: `Nuevo Pedido #${orderId} de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
    html: generateEmailHtml({ shippingInfo, orderItems, orderTotal }, orderId),
    attachments: validAttachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', orderId });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: `Error sending email: ${error.message}` });
  }
}
