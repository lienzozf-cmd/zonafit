
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import 'dotenv/config';

// Define validation schemas with Zod
const CustomerSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
    phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos."),
    address: z.string().min(10, "La dirección debe ser más detallada."),
    municipality: z.string().min(3, "El municipio es requerido."),
    department: z.string().min(3, "El departamento es requerido."),
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
  orderItems: z.array(CartItemSchema).min(1, "El carrito no puede estar vacío."),
  orderTotal: z.number(),
});

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        const origin = req.headers.get('origin');
        const allowedOrigin = process.env.URL;

        if (origin !== allowedOrigin) {
            return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 403 });
        }
    }
    
    let payload;
    try {
        payload = await req.json();
    } catch {
        return NextResponse.json({ error: 'Solicitud malformada.' }, { status: 400 });
    }

    const validationResult = OrderPayloadSchema.safeParse(payload);
    if (!validationResult.success) {
        return NextResponse.json({ error: 'Datos del pedido inválidos.', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { shippingInfo, orderItems, orderTotal } = validationResult.data;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Error: Credenciales de correo no configuradas en el archivo .env');
        return NextResponse.json({ error: "Error de configuración del servidor: el servicio de correo no está disponible." }, { status: 500 });
    }

    try {
        const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const itemsHtml = orderItems.map(item => {
            return `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">
                         ${item.name}<br>
                        <span style="color: #666; font-size: 12px;">Opción: ${item.option}${item.color ? `, Color: ${item.color}` : ''}</span><br>
                        <span style="color: #666; font-size: 12px;">Cantidad: ${item.quantity}</span>
                    </td>
                    <td style="padding: 10px; text-align: right;">Q${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `
        }).join('');

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
                <h1 style="color: #E50000; text-align: center;">Nuevo Pedido Recibido #${orderId}</h1>
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Detalles del Cliente</h2>
                <p><strong>Nombre:</strong> ${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                <p><strong>Teléfono:</strong> ${shippingInfo.phone}</p>
                <p><strong>Dirección:</strong> ${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.department}</p>
                
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Resumen del Pedido</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Producto</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <h3 style="text-align: right; margin-top: 20px;">Total del Pedido: Q${orderTotal.toFixed(2)}</h3>
                <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
                    Nota: El costo de envío se coordina por separado.
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: `"ZONA FIT GT" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECIPIENT,
            subject: `Nuevo Pedido #${orderId} - ${shippingInfo.firstName} ${shippingInfo.lastName}`,
            html: emailHtml,
        });

        return NextResponse.json({ message: 'Pedido enviado con éxito.', orderId: orderId }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el pedido:', error);
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
