import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import type { CartItem } from '@/lib/types';

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('Attempting to send Telegram notification...');
  if (!token || !chatId) {
    console.error('CRITICAL: Telegram environment variables not found. Skipping notification.');
    console.log(`- Is TELEGRAM_BOT_TOKEN set? ${!!token}`);
    console.log(`- Is TELEGRAM_CHAT_ID set? ${!!chatId}`);
    return;
  }
  
  console.log('Telegram credentials loaded successfully. Sending message...');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('Telegram API returned an error:', result.description);
    } else {
      console.log('Telegram notification sent successfully.');
    }
  } catch (error) {
    console.error('Failed to send Telegram notification (network error):', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
    
    const productionDomain = 'https://zona-fit-gt1.web.app'; 
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || productionDomain;

    const itemsWithAbsoluteImageUrls = orderItems.map((item: CartItem) => {
        const cleanPath = item.image.startsWith('/') ? item.image.substring(1) : item.image;
        const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const absoluteUrl = `${baseURL}/${encodedPath}`;

        return {
            ...item,
            image: absoluteUrl,
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
    
    // --- Create Telegram message ---
    const telegramMessage = `
*Nuevo Pedido ZONA FIT GT* 🔥
---------------------------
*ID de Orden:* #${orderId}
*Cliente:* ${shippingInfo.firstName} ${shippingInfo.lastName}
*Teléfono:* ${shippingInfo.phone}
*Email:* ${shippingInfo.email}
*Dirección:* ${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.department}
---------------------------
*Resumen:*
${itemsWithAbsoluteImageUrls.map((item: any) => `- ${item.quantity}x ${item.name} (${item.option})`).join('\n')}
---------------------------
*Subtotal:* Q${orderSubtotal.toFixed(2)}
*Envío:* Q${orderShipping.toFixed(2)}
*Comisión Contra Entrega:* Q${orderCommission.toFixed(2)}
*TOTAL:* *Q${orderTotal.toFixed(2)}*
---------------------------
*Método de Pago:* ${shippingInfo.paymentMethod === 'cod' ? 'Contra Entrega' : 'Previo Depósito'}
    `.trim();

    // --- Send Telegram Notification (Fire and forget) ---
    sendTelegramNotification(telegramMessage);


    // --- Email Sending (with robust error handling) ---
    try {
        const emailHtml = render(<OrderConfirmationEmail orderDetails={emailData} />);

        // Using the robust 'gmail' service configuration for nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'rabanalesf22@gmail.com',
            pass: 'fqzm xcmz cnwf cjtn',
          },
        });

        const mailOptions = {
          from: `"ZONA FIT GT" <rabanalesf22@gmail.com>`,
          to: [shippingInfo.email, 'rabanalesf22@gmail.com', 'rabafam2118@gmail.com'],
          subject: `Confirmación de tu pedido ZONA FIT GT #${orderId}`,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent for order #${orderId} to ${shippingInfo.email}`);
    } catch (emailError: any) {
        // Log the error but do not block the order completion
        console.error('--- CRITICAL: EMAIL SENDING FAILED ---');
        console.error('The order was processed, but the confirmation email could not be sent.');
        console.error('Please check your SMTP credentials and permissions in your hosting environment variables.');
        console.error('Error details:', emailError);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Order received successfully',
      orderId: orderId 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fatal error in send-email API:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
