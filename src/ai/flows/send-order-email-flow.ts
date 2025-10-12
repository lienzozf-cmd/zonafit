'use server';
/**
 * @fileOverview Flujo para enviar un correo de confirmación de pedido.
 *
 * - sendOrderEmail: La función principal que se invoca para enviar el correo.
 * - OrderDetails: El tipo de datos para los detalles del pedido.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';
import { CartItem } from '@/lib/types';

// Esquema para los datos de envío
const ShippingInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string(),
  department: z.string(),
  municipality: z.string(),
});

// Esquema para los ítems del pedido
const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  quantity: z.number(),
});

// Esquema para los detalles completos del pedido
const OrderDetailsSchema = z.object({
  shippingInfo: ShippingInfoSchema,
  orderItems: z.array(OrderItemSchema),
  orderTotal: z.number(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

// Herramienta (Tool) de Genkit para enviar correos electrónicos usando nodemailer
const emailSender = ai.defineTool(
  {
    name: 'emailSender',
    description: 'Sends an email using nodemailer.',
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      html: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Configuración del transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_SERVER_USER, // Tu correo de Gmail
        pass: process.env.EMAIL_SERVER_PASSWORD, // Tu contraseña de aplicación de Gmail
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"ZONA FIT GT" <${process.env.EMAIL_SERVER_USER}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return 'Correo enviado exitosamente.';
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  }
);

// Flujo principal de Genkit
const sendOrderEmailFlow = ai.defineFlow(
  {
    name: 'sendOrderEmailFlow',
    inputSchema: OrderDetailsSchema,
    outputSchema: z.void(),
  },
  async (details) => {
    // Generar el contenido HTML del correo
    const generateEmailHtml = (details: OrderDetails) => {
      const { shippingInfo, orderItems, orderTotal } = details;
      const itemsHtml = orderItems
        .map(
          (item) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; display: flex; align-items: center;">
            <img src="${item.image}" alt="${item.name}" width="60" style="border-radius: 8px; margin-right: 15px;" />
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
          <h1 style="color: #E50000; text-align: center;">¡Nuevo Pedido en ZONA FIT GT!</h1>
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

    const emailHtml = generateEmailHtml(details);

    // Usar la herramienta para enviar el correo
    await emailSender({
      to: 'rabanalesf22@gmail.com',
      subject: `Nuevo Pedido de ${details.shippingInfo.firstName} ${details.shippingInfo.lastName}`,
      html: emailHtml,
    });
  }
);

// Función exportada que el cliente llamará
export async function sendOrderEmail(details: OrderDetails) {
  return await sendOrderEmailFlow(details);
}
