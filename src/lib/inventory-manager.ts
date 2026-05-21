import { supabaseServer } from './supabase';

/**
 * Genera un ID de orden secuencial a partir de la secuencia de Supabase.
 */
export async function getNextOrderId(): Promise<string> {
    try {
        const { data, error } = await supabaseServer.rpc('get_next_order_id');
        if (error) {
            throw error;
        }
        return data as string;
    } catch (error) {
        console.error('Error generating order ID from Supabase:', error);
        // Fallback safety ID
        const now = new Date();
        const timePart = `${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
        return `${timePart}-${randomPart}`;
    }
}

/**
 * Actualiza el stock en Supabase usando una función RPC atómica.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        const { data, error } = await supabaseServer.rpc('decrement_stock', {
            p_product_id: productId,
            p_option_value: optionValue,
            p_quantity: quantity,
            p_color_name: colorName || null
        });

        if (error) {
            console.error(`Error executing decrement_stock for product ${productId}:`, error.message);
            return;
        }

        if (data === true) {
            console.log(`✅ Stock decrementado exitosamente en Supabase para Producto ID: ${productId}, Opción: ${optionValue}, Color: ${colorName || 'N/A'}`);
        } else {
            console.warn(`⚠️ No se pudo decrementar stock (probablemente no hay suficiente stock o variante no encontrada) para Producto ID: ${productId}`);
        }
    } catch (error) {
        console.error('Error no crítico en updateStock Supabase:', error);
    }
}
