
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
    // Make sure the path starts from the project's public directory
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const file = await fs.readFile(fullPath);
    const contentType = imagePath.endsWith('.png') ? 'image/png' : imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg' : 'image/webp';
    return `data:${contentType};base64,${file.toString('base64')}`;
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
    
    // --- Preparación de Detalles del Correo con imágenes en base64 ---
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
