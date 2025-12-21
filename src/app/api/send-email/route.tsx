
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
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

    // --- Validación de Datos ---
    if (!shippingInfo || !orderItems || !orderTotal || orderItems.length === 0) {
      return NextResponse.json({ message: 'Faltan datos en el pedido.' }, { status: 400 });
    }

    // --- Generación de ID de Orden ---
    const orderId = await getNextOrderId();

    // --- Actualización de Inventario ---
    for (const item of orderItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color);
    }
    
    // --- Preparación de Detalles del Correo ---
    const emailData = {
      shippingInfo,
      orderItems: orderItems.map((item: CartItem) => ({
        ...item,
        subtotal: (item.price * item.quantity).toFixed(2),
      })),
      orderSubtotal,
      orderDiscount,
      orderShipping,
      orderCommission,
      orderTotal,
      orderId,
    };

    const emailHtml = render(<OrderConfirmationEmail orderDetails={emailData} />);

    // --- Configuración de Nodemailer ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"ZONA FIT GT" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Se envía a ti mismo
      subject: `¡Nuevo Pedido! Orden #${orderId}`,
      html: emailHtml,
    };

    // --- Envío del Correo ---
    await transporter.sendMail(mailOptions);
    console.log(`Correo de confirmación enviado para la orden #${orderId}`);
    
    // --- Respuesta Exitosa ---
    return NextResponse.json({ 
      success: true,
      message: 'Pedido recibido y correo enviado correctamente',
      orderId: orderId 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error en API send-email:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
