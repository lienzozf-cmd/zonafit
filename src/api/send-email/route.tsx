
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getNextOrderId } from '@/lib/inventory-manager';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
import 'dotenv/config';

// Define validation schemas with Zod
const CustomerSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(10, 'La dirección debe ser más detallada.'),
  department: z.string().trim().min(3, 'El departamento es requerido.'),
  municipality: z.string().trim().min(3, 'El municipio es requerido.'),
});

const CartItemSchema = z.object({
  id: z.string(),
  productId: z.number(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  color: z.string().optional().nullable(),
});

const OrderPayloadSchema = z.object({
  shippingInfo: CustomerSchema,
  orderItems: z.array(CartItemSchema).min(1, 'El carrito no puede estar vacío.'),
  orderTotal: z.number(),
});

function formatItemsToHtml(items: any[], total: number) {
  const itemsHtml = items
    .map((item) => {
      const imageCid = `product-image-${item.productId}-${item.option.replace(/\s/g, '_')}`;
      return `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; vertical-align: top;">
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 80px; padding-right: 15px;">
                            <img src="cid:${imageCid}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; display: block; border: 0;">
                        </td>
                        <td>
                            <p style="margin: 0; font-size: 14px;">${item.name}</p>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #555;">Opción: ${item.option}</p>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #555;">Cantidad: ${item.quantity}</p>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="padding: 10px; text-align: right; vertical-align: top;">Q${(
              item.price * item.quantity
            ).toFixed(2)}</td>
        </tr>
    `;
    })
    .join('');

  return `
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
            <thead>
                <tr style="border-bottom: 2px solid #eee;">
                    <th style="text-align: left; padding: 10px; font-size: 16px;">Producto</th>
                    <th style="text-align: right; padding: 10px; font-size: 16px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr style="border-top: 2px solid #000; font-weight: bold;">
                    <td style="padding: 15px 10px 0;">Total del Pedido</td>
                    <td style="padding: 15px 10px 0; text-align: right;">Q${total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
}

export async function POST(req: NextRequest) {
  // 1. Security Check: Verify Origin (only in production)
  if (process.env.NODE_ENV === 'production') {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedOrigin = process.env.URL || 'https://zona-fit-gt-online.web.app';

    const isAllowed =
      (origin && origin === allowedOrigin) ||
      (referer && referer?.startsWith(allowedOrigin + '/'));
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Acceso no autorizado.' },
        { status: 403 }
      );
    }
  }

  // 2. Get and Validate Payload
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Solicitud malformada.' },
      { status: 400 }
    );
  }

  const validationResult = OrderPayloadSchema.safeParse(payload);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Datos del pedido inválidos.',
        details: validationResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const {
    shippingInfo,
    orderItems: clientItems,
    orderTotal,
  } = validationResult.data;

  // Check for email credentials early
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      'ADVERTENCIA: Las credenciales de correo no están configuradas en el archivo .env. El pedido se procesará, pero el correo electrónico de notificación no se enviará. Por favor, configura las variables de entorno EMAIL_USER, EMAIL_PASS y EMAIL_RECIPIENT.'
    );
    
    // Return a success response to the client so the UI doesn't break
    const tempOrderId = await getNextOrderId(); // Still generate an ID for the user
    return NextResponse.json(
        { message: 'Pedido procesado con éxito (notificación por correo deshabilitada).', orderId: tempOrderId },
        { status: 200 }
      );
  }

  try {
    const attachments = [];
    
    // Prepare attachments
    for (const item of clientItems) {
      const imageCid = `product-image-${item.productId}-${item.option.replace(/\s/g, '_')}`;
      if (item.image) {
        const imagePath = path.join(process.cwd(), 'public', item.image);
        try {
          const imageContent = await fs.readFile(imagePath);
          attachments.push({
            filename: path.basename(item.image),
            content: imageContent,
            cid: imageCid,
          });
        } catch (err) {
          console.error(
            `Error reading image file for attachment ${item.productId}:`,
            err
          );
        }
      }
    }

    // 4. Get a new unique order ID
    const orderId = await getNextOrderId();

    // 5. Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const shopName = 'ZONA FIT GT';
    const itemsHtml = formatItemsToHtml(clientItems, orderTotal);

    // 6. Send Admin Email
    await transporter.sendMail({
      from: `"${shopName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: `Nuevo Pedido #${orderId} - ${shippingInfo.firstName} ${shippingInfo.lastName}`,
      html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <div style="background-color: #E50000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="font-size: 24px; color: #fff;">Nuevo Pedido #${orderId}</h1>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="font-size: 20px; color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Detalles del Cliente</h2>
                        <p><strong>Nombre:</strong> ${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                        <p><strong>Teléfono:</strong> ${shippingInfo.phone}</p>
                        <p><strong>Dirección:</strong> ${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.department}</p>
                        <h2 style="font-size: 20px; color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Artículos del Pedido</h2>
                        ${itemsHtml}
                    </div>
                </div>
            `,
      attachments: attachments,
    });

    return NextResponse.json(
      { message: 'Pedido enviado con éxito.', orderId: orderId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error procesando el pedido:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
