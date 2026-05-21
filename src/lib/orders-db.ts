import { supabaseServer } from './supabase';

export interface OrderData {
  orderId: string;
  shippingInfo: any;
  orderItems: any[];
  orderSubtotal: number;
  orderDiscount: number;
  orderShipping: number;
  orderCommission: number;
  orderTotal: number;
  createdAt?: any;
}

export async function saveOrder(orderData: OrderData) {
  try {
    // 1. Insert order
    const { error: orderError } = await supabaseServer.from('orders').insert({
      order_id: orderData.orderId,
      shipping_info: orderData.shippingInfo,
      order_subtotal: orderData.orderSubtotal,
      order_discount: orderData.orderDiscount,
      order_shipping: orderData.orderShipping,
      order_commission: orderData.orderCommission,
      order_total: orderData.orderTotal,
    });

    if (orderError) throw orderError;

    // 2. Insert items
    const itemsToInsert = orderData.orderItems.map((item) => ({
      order_id: orderData.orderId,
      product_id: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      option: item.option,
      color: item.color || null,
    }));

    const { error: itemsError } = await supabaseServer.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

    console.log(`Order ${orderData.orderId} written to Supabase successfully.`);
    return orderData.orderId;
  } catch (e) {
    console.error("Error adding order to Supabase: ", e);
    throw e;
  }
}

export async function getOrders(): Promise<OrderData[]> {
  try {
    // Fetch orders and join order_items
    const { data: ordersData, error } = await supabaseServer
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (ordersData || []).map((order) => ({
      orderId: order.order_id,
      shippingInfo: order.shipping_info,
      orderItems: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: item.quantity,
        option: item.option,
        color: item.color,
      })),
      orderSubtotal: Number(order.order_subtotal),
      orderDiscount: Number(order.order_discount),
      orderShipping: Number(order.order_shipping),
      orderCommission: Number(order.order_commission),
      orderTotal: Number(order.order_total),
      createdAt: order.created_at ? new Date(order.created_at) : new Date(),
    }));
  } catch (e) {
    console.error("Error getting orders from Supabase: ", e);
    return [];
  }
}
