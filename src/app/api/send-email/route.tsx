
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import type { CartItem } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Helper to convert image to base64
async function imageToBase64(imagePath: string): Promise<string | null> {
  try {
    // Ensure the path starts from the project's public directory
    const fullPath = path.join(process.cwd(), 'public', imagePath.startsWith('/') ? imagePath : `/${imagePath}`);
    const file = await fs.readFile(fullPath);
    const contentType = path.extname(fullPath).slice(1) || 'png';
    return `data:image/${contentType};base64,${file.toString('base64')}`;
  } catch (error) {
    console.error(`Error reading image file at ${imagePath}:`, error);
    return null; // Return null if image can't be read
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
    if (!shippingInfo || !orderItems || !orderTotal || orderItems.length === 0) {
      return NextResponse.json({ message: 'Missing order data.' }, { status: 400 });
    }

    // --- Order ID Generation ---
    const orderId = await getNextOrderId();

    // --- Inventory Update ---
    for (const item of orderItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color);
    }
    
    // --- Prepare Email Details with base64 images ---
    const itemsWithBase64Images = await Promise.all(
        orderItems.map(async (item: CartItem) => {
            const base64Image = await imageToBase64(item.image);
            return {
                ...item,
                image: base64Image || item.image, // Fallback to original path if conversion fails
                subtotal: (item.price * item.quantity).toFixed(2),
            };
        })
    );

    const emailData = {
      shippingInfo,
      orderItems: itemsWithBase64Images,
      orderSubtotal,
      orderDiscount,
      orderShipping,
      orderCommission,
      orderTotal,
      orderId,
    };

    const emailHtml = render(<OrderConfirmationEmail orderDetails={emailData} />);

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
      to: process.env.SMTP_EMAIL, // Send to yourself
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
