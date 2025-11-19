import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Helper to generate HTML for the email
const generateEmailHtml = (details: any) => {
  const { shippingInfo, orderItems, orderTotal } = details;
  const itemsHtml = orderItems
    .map(
      (item: any) => `
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { shippingInfo, orderItems, orderTotal } = req.body;

  if (!shippingInfo || !orderItems || !orderTotal) {
    return res.status(400).json({ message: 'Missing order details' });
  }

  // IMPORTANT: You need to set these environment variables in your .env file
  // For Gmail, you will need to generate an "App Password"
  // https://myaccount.google.com/apppasswords
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `ZONA FIT GT <${process.env.EMAIL_USER}>`,
    to: 'rabafam2118@gmail.com',
    subject: `Nuevo Pedido de ${shippingInfo.firstName} ${shippingInfo.lastName}`,
    html: generateEmailHtml({ shippingInfo, orderItems, orderTotal }),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: `Error sending email: ${error.message}` });
  }
}
