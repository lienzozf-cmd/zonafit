'use server';
/**
 * @fileOverview Flow to send an order confirmation email via Gmail.
 *
 * - sendGmail: The main function to be called to send the email.
 * - OrderDetails: The data type for order details.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';


// Schema for shipping information
const ShippingInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string(),
  department: z.string(),
  municipality: z.string(),
});

// Schema for order items
const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  quantity: z.number(),
});

// Schema for the complete order details
const OrderDetailsSchema = z.object({
  shippingInfo: ShippingInfoSchema,
  orderItems: z.array(OrderItemSchema),
  orderTotal: z.number(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

export async function sendGmail(details: OrderDetails) {
  return await sendGmailFlow(details);
}

const sendGmailFlow = ai.defineFlow(
  {
    name: 'sendGmailFlow',
    inputSchema: OrderDetailsSchema,
    outputSchema: z.void(),
  },
  async (details) => {
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

    // Use the built-in Gmail tool
    await ai.run('google.gmail/send', {
      to: ['rabafam2118@gmail.com'],
      subject: `Nuevo Pedido de ${details.shippingInfo.firstName} ${details.shippingInfo.lastName}`,
      body: {
        mediaType: 'text/html',
        content: emailHtml,
      },
    });
  }
);
