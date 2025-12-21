
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation-email';
import { getNextOrderId, updateStock } from '@/lib/inventory-manager';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  department: string;
  municipality: string;
}

interface OrderItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  option: string;
  color?: string;
  quantity: number;
}

interface OrderDetails {
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  orderTotal: number;
}

export async function POST(req: Request) {
  try {
    const { shippingInfo, orderItems, orderTotal }: OrderDetails = await req.json();

    if (!shippingInfo || !orderItems || !orderTotal) {
      return NextResponse.json({ message: 'Faltan datos del pedido.' }, { status: 400 });
    }

    const orderId = await getNextOrderId();

    // Actualizar el stock de cada producto
    for (const item of orderItems) {
      await updateStock(item.productId, item.option, item.quantity, item.color);
    }
    
    const emailHtml = await resend.emails.send({
      from: 'ZONA FIT GT <onboarding@resend.dev>',
      to: ['carlosrabanales@gmail.com'],
      subject: `¡Nuevo Pedido! - Orden #${orderId}`,
      react: OrderConfirmationEmail({ 
        orderDetails: {
          ...{ shippingInfo, orderItems, orderTotal },
          orderItems: orderItems.map(item => ({
            ...item,
            subtotal: (item.price * item.quantity).toFixed(2),
          })),
          orderId
        }
      }),
    });

    return NextResponse.json({ 
      message: '¡Pedido procesado con éxito!',
      orderId: orderId,
      emailInfo: emailHtml.data 
    });

  } catch (error: any) {
    console.error('Error al procesar el pedido:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
