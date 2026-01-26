import fs from 'fs/promises';
import path from 'path';
import type { Product } from './data';

// --- Paths ---
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');
const orderCounterPath = path.join(process.cwd(), 'order-counter.txt');


/**
 * Genera un ID de orden secuencial a partir de un archivo contador.
 * Si la lectura o escritura del archivo falla (común en entornos serverless),
 * usa un ID de respaldo basado en la fecha para no detener el pedido.
 */
export async function getNextOrderId(): Promise<string> {
    try {
        const data = await fs.readFile(orderCounterPath, 'utf-8');
        const currentId = parseInt(data.trim(), 10);
        const nextId = currentId + 1;
        
        try {
            // Intenta escribir el nuevo valor, pero no detiene el proceso si falla.
            await fs.writeFile(orderCounterPath, nextId.toString(), 'utf-8');
        } catch (writeError) {
            console.warn('⚠️ No se pudo escribir en order-counter.txt. El contador no se actualizará en el servidor.');
        }

        // Devuelve el ID secuencial con el formato 0000XX
        return nextId.toString().padStart(6, '0');
    } catch (readError) {
        console.warn('⚠️ No se pudo leer order-counter.txt. Usando un ID de respaldo basado en la fecha.');
        // Fallback a un ID único si no se puede leer el archivo contador.
        const now = new Date();
        const timePart = `${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
        return `${timePart}-${randomPart}`;
    }
}

/**
 * Actualiza el stock en products.json de forma SEGURA.
 * Si falla la lectura o escritura, NO rompe el pedido del cliente.
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
