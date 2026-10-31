import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';
import { saveOrder } from '@/lib/orders-db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { products as catalogProducts } from '@/lib/data';
import { supabaseServer } from '@/lib/supabase';
import type { CartItem } from '@/lib/types';

// Zod validation schemas
const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  option: z.string().trim().min(1).max(50),
  color: z.string().trim().max(50).optional().nullable(),
  quantity: z.number().int().min(1).max(50),
  price: z.number().optional(),
  image: z.string().optional().nullable(),
});

const shippingInfoSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(60),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.').max(60),
  email: z.string().trim().email('Correo electrónico inválido.').max(100),
  phone: z.string().trim().regex(/^\d{8}$/, 'El número de teléfono debe tener exactamente 8 dígitos.'),
  address: z.string().trim().min(5, 'La dirección debe ser más detallada.').max(250),
  department: z.string().trim().min(2).max(100),
  municipality: z.string().trim().min(2).max(100),
  paymentMethod: z.enum(['deposit', 'cod'], {
    errorMap: () => ({ message: 'Método de pago no válido.' }),
  }),
});

const orderRequestSchema = z.object({
  shippingInfo: shippingInfoSchema,
  orderItems: z.array(orderItemSchema).min(1, 'El carrito no puede estar vacío.').max(50),
  orderSubtotal: z.number().optional(),
  orderDiscount: z.number().optional(),
  orderShipping: z.number().optional(),
  orderCommission: z.number().optional(),
  orderTotal: z.number().optional(),
});

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseCatalogPrice(priceStr: string | number | undefined): number {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const clean = priceStr.toString().replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
}

async function sendTelegramNotification(htmlMessage: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('TELEGRAM: Token o ChatId no configurados. Saltando notificación.');
    return;
  }
  
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: htmlMessage,
    parse_mode: 'HTML',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('Telegram API error:', result.description);
    } else {
      console.log('Telegram notification sent successfully.');
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

async function syncOrderToGoogleSheets(data: {
  shippingInfo: any;
  orderItems: any[];
  orderTotal: number;
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('GOOGLE_SHEETS_WEBHOOK_URL not configured. Skipping sheets sync.');
    return;
  }

  try {
    const payload = {
      cliente: {
        nombre: data.shippingInfo?.firstName || '',
        apellido: data.shippingInfo?.lastName || '',
        telefono: data.shippingInfo?.phone || '',
      },
      items: data.orderItems.map((item: any) => {
        let cleanName = (item.name || '').trim();
        const color = (item.color || '').trim();
        if (color && cleanName.toLowerCase().endsWith(` - ${color.toLowerCase()}`)) {
          cleanName = cleanName.substring(0, cleanName.length - (` - ${color}`).length).trim();
        }
        return {
          nombre: cleanName,
          talla: item.option || '',
          color: color,
          cantidad: item.quantity || 1,
          precio: Number(item.price) || 0,
        };
      })
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);
    console.log('Google Sheets sync result:', result);
  } catch (error) {
    console.error('Non-critical error syncing to Google Sheets:', error);
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting: max 5 checkouts per 5 minutes per IP
    const ip = await getClientIp();
    const limiter = rateLimit(ip, 5, 5 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { message: 'Demasiadas solicitudes de compra desde su dirección. Por favor espere unos minutos e intente de nuevo.' },
        { status: 429 }
      );
    }

    // 2. Validate input schema with Zod
    const body = await request.json();
    const parseResult = orderRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const errorDetails = parseResult.error.flatten();
      console.warn('Order rejected due to validation errors:', errorDetails);
      return NextResponse.json({
        message: 'Datos de pedido inválidos.',
        errors: errorDetails.fieldErrors,
      }, { status: 400 });
    }

    const { shippingInfo, orderItems, orderTotal: clientClaimedTotal } = parseResult.data;

    // 3. Server-side price lookup and validation (Prevents client-side price tampering)
    const productIds = Array.from(new Set(orderItems.map(i => i.productId)));
    
    // Query authoritative price from Supabase
    const { data: dbProducts } = await supabaseServer
      .from('products')
      .select('id, price, name')
      .in('id', productIds);

    const priceMap = new Map<number, number>();
    if (dbProducts) {
      for (const p of dbProducts) {
        priceMap.set(p.id, parseCatalogPrice(p.price));
      }
    }

    // Fallback lookup in static catalog for any products not in db
    for (const p of catalogProducts) {
      if (!priceMap.has(p.id)) {
        priceMap.set(p.id, parseCatalogPrice(p.price));
      }
    }

    // Recalculate authoritative subtotal
    let calculatedSubtotal = 0;
    const validatedItems = orderItems.map((item) => {
      const unitPrice = priceMap.get(item.productId);
      if (unitPrice === undefined || unitPrice <= 0) {
        throw new Error(`Producto ID ${item.productId} no encontrado o sin precio válido.`);
      }
      const itemSubtotal = unitPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      return {
        ...item,
        price: unitPrice,
        subtotal: itemSubtotal.toFixed(2),
      };
    });

    const calculatedDiscount = 0;
    const calculatedShipping = 35; // Standard flat shipping Q.35
    const calculatedCommission = shippingInfo.paymentMethod === 'cod' 
      ? Math.round(calculatedSubtotal * 0.04) 
      : 0;
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedShipping + calculatedCommission;

    // Security check: Detect client-side price tampering attempts
    if (clientClaimedTotal !== undefined && Math.abs(clientClaimedTotal - calculatedTotal) > 1.0) {
      console.warn(`[SECURITY ALERT] Price tampering detected! Client claimed Q${clientClaimedTotal}, Server calculated Q${calculatedTotal}. Overriding with authoritative price.`);
    }

    // 4. Order ID Generation
    const orderId = await getNextOrderId();

    // 5. Decrement Inventory atomically
    for (const item of validatedItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color || undefined);
    }
    
    const productionDomain = 'https://zona-fit-gt1.web.app'; 
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || productionDomain;

    const itemsWithAbsoluteImageUrls = validatedItems.map((item) => {
      let imageUrl = item.image || 'https://picsum.photos/seed/placeholder/200/200';
      
      if (!imageUrl.startsWith('http')) {
        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
        imageUrl = `${baseURL}/${encodedPath}`;
      }

      return {
        ...item,
        image: imageUrl,
      };
    });

    const finalOrderData = {
      shippingInfo,
      orderItems: itemsWithAbsoluteImageUrls,
      orderSubtotal: calculatedSubtotal,
      orderDiscount: calculatedDiscount,
      orderShipping: calculatedShipping,
      orderCommission: calculatedCommission,
      orderTotal: calculatedTotal,
      orderId,
    };

    // 6. Persist Order to Supabase
    try {
      await saveOrder(finalOrderData);
      console.log(`Order #${orderId} persisted to Supabase successfully.`);
    } catch (saveError) {
      console.error('CRITICAL: Failed to save order to Supabase:', saveError);
    }
    
    // 7. Format Telegram notification in safe HTML (Prevents markdown formatting errors/injection)
    const telegramHtml = `
<b>🔥 Nuevo Pedido ZONA FIT GT</b>
--------------------------------------
<b>ID de Orden:</b> #${escapeHtml(orderId)}
<b>Cliente:</b> ${escapeHtml(shippingInfo.firstName)} ${escapeHtml(shippingInfo.lastName)}
<b>Teléfono:</b> ${escapeHtml(shippingInfo.phone)}
<b>Email:</b> ${escapeHtml(shippingInfo.email)}
<b>Dirección:</b> ${escapeHtml(shippingInfo.address)}, ${escapeHtml(shippingInfo.municipality)}, ${escapeHtml(shippingInfo.department)}
--------------------------------------
<b>Resumen de Productos:</b>
${itemsWithAbsoluteImageUrls.map((item) => `• ${item.quantity}x ${escapeHtml(item.name)} (${escapeHtml(item.option)}${item.color ? ` - ${escapeHtml(item.color)}` : ''}) - Q${(item.price * item.quantity).toFixed(2)}`).join('\n')}
--------------------------------------
<b>Subtotal:</b> Q${calculatedSubtotal.toFixed(2)}
${calculatedDiscount > 0 ? `<b>Descuento:</b> -Q${calculatedDiscount.toFixed(2)}\n` : ''}<b>Envío:</b> Q${calculatedShipping.toFixed(2)}
<b>Comisión Contra Entrega:</b> Q${calculatedCommission.toFixed(2)}
<b>TOTAL:</b> <b>Q${calculatedTotal.toFixed(2)}</b>
--------------------------------------
<b>Método de Pago:</b> ${shippingInfo.paymentMethod === 'cod' ? 'Contra Entrega' : 'Previo Depósito'}
    `.trim();

    await sendTelegramNotification(telegramHtml);

    // 8. Sync with Google Sheets
    await syncOrderToGoogleSheets({
      shippingInfo,
      orderItems: validatedItems,
      orderTotal: calculatedTotal,
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Order received successfully',
      orderId: orderId,
      total: calculatedTotal
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fatal error in checkout API:', error);
    return NextResponse.json(
      { message: 'Error al procesar el pedido. Por favor intente nuevamente.', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
