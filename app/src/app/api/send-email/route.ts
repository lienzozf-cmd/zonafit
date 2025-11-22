
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { products } from '@/lib/data';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
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
    id: z.string(), // cart-item-id (e.g., 'prod-1-variant-2')
    productId: z.number(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number(), // Client price, to be validated on server
    imageUrls: z.array(z.string()),
    aiHint: z.string(),
});

const OrderPayloadSchema = z.object({
  customer: CustomerSchema,
  items: z.array(CartItemSchema).min(1, "El carrito no puede estar vacío."),
});

// Helper to get and increment the order ID from a file
async function getNextOrderId(): Promise<string> {
    const counterPath = path.join(process.cwd(), 'order-counter.txt');
    let nextCount;
    try {
        const currentCountStr = await fs.readFile(counterPath, 'utf-8');
        const currentCount = parseInt(currentCountStr.trim(), 10);
        nextCount = currentCount + 1;
    } catch (error) {
        // If file doesn't exist or is empty, start from 1
        nextCount = 1;
    }
    await fs.writeFile(counterPath, nextCount.toString(), 'utf-8');
    // Format to 6 digits with leading zeros
    return nextCount.toString().padStart(6, '0');
}

// Helper to update stock in inventory.json
async function updateStock(itemId: string | number, quantitySold: number) {
    const inventoryPath = path.join(process.cwd(), 'src', 'lib', 'inventory.json');
    const itemIdStr = String(itemId);
    try {
        const inventoryData = await fs.readFile(inventoryPath, 'utf-8');
        const inventory = JSON.parse(inventoryData);

        if (itemIdStr in inventory) {
            inventory[itemIdStr] -= quantitySold;
            if (inventory[itemIdStr] < 0) {
                inventory[itemIdStr] = 0; // Prevent negative stock
            }
            await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2), 'utf-8');
        } else {
            console.warn(`Item ID "${itemIdStr}" not found in inventory.json`);
        }
    } catch (error) {
        console.error('Failed to read or write inventory.json:', error);
        throw new Error('Failed to update stock.');
    }
}

export async function POST(req: NextRequest) {
    // 1. Security Check: Verify Origin (only in production)
    if (process.env.NODE_ENV === 'production') {
        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');
        const allowedOrigin = process.env.URL;

        const isAllowed = (origin && origin === allowedOrigin) || (referer && referer?.startsWith(allowedOrigin + '/'));

        if (!isAllowed) {
            return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 403 });
        }
    }
    
    // 2. Get and Validate Payload
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

    const { customer, items: clientItems } = validationResult.data;

    // Check for email credentials early
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Error: Credenciales de correo no configuradas en el archivo .env');
        return NextResponse.json({ error: "Error de configuración del servidor: el servicio de correo no está disponible." }, { status: 500 });
    }

    try {
        // 3. Security: Recalculate total and validate items on the server
        let serverCalculatedTotal = 0;
        const validatedItems = [];
        const emailAttachments = [];


        for (const [index, item] of clientItems.entries()) {
            const baseProduct = products.find(p => p.id === item.productId);

            if (!baseProduct) {
                throw new Error(`Producto no encontrado con ID: ${item.productId}`);
            }
            
            const serverPrice = parseFloat(baseProduct.price.replace(/Q\.|\s/g, ''));
            let name = baseProduct.name;
            let stockItemId : string | number = baseProduct.id; // ID for stock management
            let imageUrl = item.imageUrls[0];
            
            if (serverPrice !== item.price) {
                 console.warn(`Price mismatch for ${name}. Client: ${item.price}, Server: ${serverPrice}. Using server price.`);
            }

            // For simplicity, we assume the cart logic already handled variants
            // and the `item.id` from the cart is the unique identifier for stock.
            // Example cart item.id: `1-Roja-M`
            stockItemId = item.id;

            // Update stock - This is disabled as stock is now managed by zustand store
            // await updateStock(stockItemId, item.quantity);

            serverCalculatedTotal += serverPrice * item.quantity;
            
            const imageCid = `product-image-${index}`;
            validatedItems.push({
                ...item,
                price: serverPrice, // Use server price
                name: item.name,   // Use client-provided name which includes variant info
                imageUrl: `cid:${imageCid}`
            });

            // Prepare image attachment for Nodemailer
            const imagePath = path.join(process.cwd(), 'public', imageUrl);
            try {
                // Check if file exists before trying to attach
                await fs.access(imagePath);
                emailAttachments.push({
                    filename: path.basename(imageUrl),
                    path: imagePath,
                    cid: imageCid
                });
            } catch (err) {
                console.warn(`Image file not found, skipping attachment: ${imagePath}`);
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

        // 6. Generate HTML for the email
        const itemsHtml = validatedItems.map(item => {
            return `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">
                        <img src="${item.imageUrl}" alt="${item.name}" width="60" style="border-radius: 8px;">
                    </td>
                    <td style="padding: 10px;">
                        ${item.name}<br>
                        <span style="color: #666; font-size: 12px;">Cantidad: ${item.quantity}</span>
                    </td>
                    <td style="padding: 10px; text-align: right;">Q${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `
        }).join('');

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
                <h1 style="color: #d63384; text-align: center;">Nuevo Pedido Recibido #${orderId}</h1>
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Detalles del Cliente</h2>
                <p><strong>Nombre:</strong> ${customer.firstName} ${customer.lastName}</p>
                <p><strong>Teléfono:</strong> ${customer.phone}</p>
                <p><strong>Dirección:</strong> ${customer.address}, ${customer.municipality}, ${customer.department}</p>
                
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Resumen del Pedido</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th colspan="2" style="padding: 10px; text-align: left;">Producto</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <h3 style="text-align: right; margin-top: 20px;">Total del Pedido: Q${serverCalculatedTotal.toFixed(2)}</h3>
                <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
                    Nota: El costo de envío se coordina por separado.
                </p>
            </div>
        `;

        // 7. Send the email
        await transporter.sendMail({
            from: `"ZONA FIT GT" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECIPIENT,
            subject: `Nuevo Pedido #${orderId} - ${customer.firstName} ${customer.lastName}`,
            html: emailHtml,
            attachments: emailAttachments,
        });

        return NextResponse.json({ message: 'Pedido enviado con éxito.', orderId: orderId }, { status: 200 });

    } catch (error) {
        console.error('Error procesando el pedido:', error);
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
