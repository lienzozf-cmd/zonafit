import { NextResponse } from 'next/server';
import { render } from 'react-email';
import nodemailer from 'nodemailer';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import type { CartItem } from '@/lib/types';

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
    
    // --- PREPARAR URLS DE IMAGENES (CORRECCIÓN AQUÍ) ---
    
    // 1. Define tu dominio real de producción aquí como fallback.
    // NO uses localhost aquí. Usa tu dominio de Firebase/Vercel.
    const productionDomain = 'https://zona-fit-gt1.web.app'; 
    
    // Intenta leer la variable de entorno, si no existe, usa el dominio fijo.
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || productionDomain;

    const itemsWithAbsoluteImageUrls = orderItems.map((item: CartItem) => {
        // Quitamos la barra inicial si existe para evitar dobles barras (ej: //img.png)
        const cleanPath = item.image.startsWith('/') ? item.image.substring(1) : item.image;
        
        // Codificamos la ruta por si tiene espacios o caracteres especiales
        // Ej: "foto producto.png" se convierte en "foto%20producto.png"
        const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');

        const absoluteUrl = `${baseURL}/${encodedPath}`;

        return {
            ...item,
            image: absoluteUrl,
            subtotal: (item.price * item.quantity).toFixed(2),
        };
    });

    // --- DEBUG: MIRA ESTO EN TU TERMINAL ---
    console.log("URL de imagen generada (ejemplo):", itemsWithAbsoluteImageUrls[0]?.image);

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
