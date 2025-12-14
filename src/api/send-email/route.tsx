
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { updateStock, getNextOrderId } from '@/lib/inventory-manager';
import fs from 'fs/promises';
import path from 'path';

const shippingInfoSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  phone: z.string().regex(/^\d{8}$/, 'El número de teléfono debe tener 8 dígitos.'),
  address: z.string().trim().min(5, 'La dirección debe ser más detallada.'),
  department: z.string().trim().min(3, 'El departamento es requerido.'),
  municipality: z.string().trim().min(3, 'El municipio es requerido.'),
});

const cartItemSchema = z.object({
  id: z.string(),
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  option: z.string(),
  color: z.string().optional().nullable(),
  quantity: z.number().min(1),
});

const orderSchema = z.object({
  shippingInfo: shippingInfoSchema,
  orderItems: z.array(cartItemSchema).min(1, 'El carrito no puede estar vacío.'),
  orderTotal: z.number(),
});


function formatItemsToHtml(items: any[], productTotal: number, shippingCost: number, grandTotal: number) {
    const itemsHtml = items.map(item => {
        const imageCid = `${item.productId}-${item.option}-${item.color || 'default'}`;
        
        return `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; vertical-align: top;">
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 80px; padding-right: 15px;">
                            <img src="cid:${imageCid}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; display: block; border: 0;">
                        </td>
                        <td>
                            <p style="margin: 0; font-size: 14px;">${item.name} (${item.option})</p>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #555;">Cantidad: ${item.quantity}</p>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="padding: 10px; text-align: right; vertical-align: top;">Q${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `}).join('');

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
                <tr>
                    <td style="padding: 15px 10px 5px;">Subtotal</td>
                    <td style="padding: 15px 10px 5px; text-align: right;">Q${productTotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 10px;">Envío</td>
                    <td style="padding: 5px 10px; text-align: right;">Q${shippingCost.toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #000; font-weight: bold;">
                    <td style="padding: 15px 10px 0;">Total del Pedido</td>
                    <td style="padding: 15px 10px 0; text-align: right;">Q${grandTotal.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://zona-fit-gt-online.web.app";

    const isAllowed = (origin && origin === allowedOrigin) || (referer && referer?.startsWith(allowedOrigin + '/'));
     if (!isAllowed) {
        return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 403 });
    }
  }

  let payload;
  try {
      payload = await req.json();
  } catch {
      return NextResponse.json({ error: 'Solicitud malformada.' }, { status: 400 });
  }
  
  const validationResult = orderSchema.safeParse(payload);
  
  if (!validationResult.success) {
    console.error('Error de validación de Zod:', validationResult.error.flatten());
    return NextResponse.json({
      message: 'Datos del pedido inválidos.',
      errors: validationResult.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Error: Credenciales de correo no configuradas en el archivo .env');
    return NextResponse.json({ error: "Error de configuración del servidor: el servicio de correo no está disponible." }, { status: 500 });
  }

  const { shippingInfo, orderItems } = validationResult.data;
  
  try {
    const orderId = await getNextOrderId();
    const shippingCost = 35;
    
    const attachments = [];

    for (const item of orderItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color ?? undefined);

      if (item.image) {
        const imagePath = path.join(process.cwd(), 'public', item.image);
        try {
            const imageContent = await fs.readFile(imagePath);
            attachments.push({
                filename: path.basename(item.image),
                content: imageContent,
                cid: `${item.productId}-${item.option}-${item.color || 'default'}`
            });
        } catch (err) {
            console.error(`Error reading image file for attachment ${item.productId}:`, err);
        }
    }
    }
    
    const productTotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const grandTotal = productTotal + shippingCost;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    const shopName = "ZONA FIT GT";
    const itemsHtml = formatItemsToHtml(orderItems, productTotal, shippingCost, grandTotal);

    await transporter.sendMail({
        from: `"${shopName}" <${process.env.EMAIL_USER}>`,
        to: ["rabanalesf22@gmail.com", "rabafam2118@gmail.com"],
        subject: `Nuevo Pedido #${orderId} - ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <div style="background-color: #E50000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="font-size: 24px; color: #fff;">Nuevo Pedido #${orderId}</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="font-size: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Detalles del Cliente</h2>
                    <p><strong>Nombre:</strong> ${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                    <p><strong>Teléfono:</strong> ${shippingInfo.phone}</p>
                    <p><strong>Dirección:</strong> ${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.department}</p>
                    <h2 style="font-size: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Artículos del Pedido</h2>
                    ${itemsHtml}
                </div>
                 <div style="background-color: #f5f5f5; padding: 15px; border-top: 1px solid #eee; text-align: center;">
                    <p style="margin: 0; color: #555;">Este es un correo automático. Por favor, gestiona el pedido.</p>
                </div>
            </div>
        `,
        attachments: attachments,
    });

    return NextResponse.json({ message: 'Pedido procesado y correo enviado exitosamente', orderId });

  } catch (error: any) {
    console.error('Error catastrófico en el endpoint /api/send-email:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}

    

    