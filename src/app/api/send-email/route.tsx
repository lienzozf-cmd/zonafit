
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import type { CartItem } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received order body:", JSON.stringify(body, null, 2));

    const { 
        shippingInfo, 
        orderItems,
        orderSubtotal,
        orderDiscount,
        orderShipping,
        orderCommission,
        orderTotal 
    } = body;

    // --- Data Validation ---
    if (!shippingInfo || !orderItems || !orderTotal || orderItems.length === 0 || !shippingInfo.email) {
      return NextResponse.json({ message: 'Missing order data or email.' }, { status: 400 });
    }

    // --- Order ID Generation ---
    const orderId = await getNextOrderId();

    // --- Inventory Update ---
    for (const item of orderItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color);
    }
    
    // --- Prepare Email Details ---
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zona-fit-gt1.web.app';

    const itemsWithAbsoluteImageUrls = orderItems.map((item: CartItem) => {
        // Ensure we have a clean path, removing any leading slash
        const imageUrl = item.image.startsWith('/') ? item.image.substring(1) : item.image;
        return {
            ...item,
            image: `${baseURL}/${imageUrl}`,
            subtotal: (item.price * item.quantity).toFixed(2),
        };
    });

    const emailData = {
      shippingInfo,
      orderItems: itemsWithAbsoluteImageUrls,
      orderSubtotal,
      orderDiscount,
      orderShipping,
      orderCommission,
      orderTotal,
      orderId,
    };

    const emailHtml = await render(<OrderConfirmationEmail orderDetails={emailData} />);

    // --- Nodemailer Setup ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ZONA FIT GT" <${process.env.SMTP_EMAIL}>`,
      to: 'rabanalesf22@gmail.com, rabafam2118@gmail.com',
      subject: `¡Nuevo Pedido! Orden #${orderId}`,
      html: emailHtml,
    };

    // --- Send Email ---
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent for order #${orderId}`);
    
    // --- Success Response ---
    return NextResponse.json({ 
      success: true,
      message: 'Order received and email sent successfully',
      orderId: orderId 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
