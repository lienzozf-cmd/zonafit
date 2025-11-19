import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderDetails } = req.body;

  if (!orderDetails) {
    return res.status(400).json({ message: 'Order details are missing' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ZONA FIT GT <onboarding@resend.dev>',
      to: ['rabafam2118@gmail.com'],
      subject: `Nuevo Pedido de ${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
      react: OrderConfirmationEmail({ orderDetails }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    }

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (exception) {
    console.error('An unexpected error occurred:', exception);
    const error = exception as Error;
    res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  }
}
