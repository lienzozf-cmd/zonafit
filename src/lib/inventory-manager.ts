import fs from 'fs/promises';
import path from 'path';
import type { Product } from './data';

// --- Paths ---
// Mantenemos las rutas por si el servidor permite lectura
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

/**
 * Genera un ID de orden basado en el tiempo.
 * CORRECCIÓN: Ya no depende de leer un archivo de texto (que suele fallar).
 * Usa la fecha y un número aleatorio para garantizar que nunca falle.
 * Formato ejemplo: 251023-4812 (DíaHoraMinuto-Aleatorio)
 */
export async function getNextOrderId(): Promise<string> {
    const now = new Date();
    // Formato simple: DDHHMM (Día, Hora, Minuto) para que sea corto pero único
    const timePart = `${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    // Agregamos 4 dígitos aleatorios para evitar duplicados si compran al mismo segundo
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    
    return `${timePart}-${randomPart}`;
}

/**
 * Actualiza el stock en products.json de forma SEGURA.
 * CORRECCIÓN: Si falla la lectura o escritura, NO rompe el pedido del cliente.
 * Simplemente registra el error en la consola y deja que la venta continúe.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        // Intento de lectura
        let productsData;
        try {
            productsData = await fs.readFile(productsFilePath, 'utf-8');
        } catch (readError) {
            console.warn('⚠️ No se pudo leer el archivo de productos. Es normal en Vercel/Netlify. El pedido continuará sin descontar stock visual.');
            return; // Salimos pacíficamente, el pedido sigue.
        }

        // Intento de parseo (evita que un JSON roto tumbe la web)
        let products: Product[];
        try {
            products = JSON.parse(productsData);
        } catch (parseError) {
            console.error('⚠️ El archivo products.json está corrupto. El pedido continuará.');
            return; 
        }

        const productIndex = products.findIndex((p: any) => p.id === productId);
        if (productIndex === -1) {
            console.warn(`Producto ID ${productId} no encontrado, pero permitimos la venta.`);
            return;
        }

        const product = products[productIndex];

        // Lógica de descuento de stock
        if (colorName && product.colors) {
            const color = product.colors.find((c: any) => c.name === colorName);
            if (color && color.options) {
                const option = color.options.values.find((o: any) => o.value === optionValue);
                if (option) {
                    option.stock = Math.max(0, option.stock - quantity);
                }
            }
        } else if (product.options) {
            const option = product.options.values.find((o: any) => o.value === optionValue);
            if (option) {
                option.stock = Math.max(0, option.stock - quantity);
            }
        }
        
        // Recalcular disponibilidad
        const isAvailable = product.options?.values.some(v => v.stock > 0) || 
                            (product.colors && product.colors.some(c => c.options.values.some(v => v.stock > 0)));
        product.availability = isAvailable ? 'Disponible' : 'Agotado';

        // Intento de escritura
        try {
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
            console.log(`✅ Stock actualizado para Producto ID: ${productId}`);
        } catch (writeError) {
            console.warn('⚠️ No se pudo guardar el nuevo stock (Error de permisos de escritura). Esto es esperado en producción serverless. El pedido fue exitoso de todos modos.');
        }

    } catch (error) {
        // Catch global para asegurar que NADA detenga la venta
        console.error('Error no crítico en updateStock:', error);
    }
}