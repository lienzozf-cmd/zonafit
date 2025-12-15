import fs from 'fs/promises';
import path from 'path';

// --- Paths ---
const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

// Variable en memoria para el contador
let orderCounter = -1;

/**
 * Retrieves the next order ID by reading from a counter file once,
 * and then managing it in memory.
 * @returns {Promise<string>} The next order ID, padded with leading zeros.
 */
export async function getNextOrderId(): Promise<string> {
    if (orderCounter === -1) {
        try {
            const data = await fs.readFile(counterFilePath, 'utf-8');
            orderCounter = parseInt(data.trim(), 10);
        } catch (error) {
            console.log('Counter file not found or unreadable, starting from 0.');
            orderCounter = 0;
        }
    }
    
    orderCounter++;
    // No se escribe en el archivo para evitar reinicios del servidor en desarrollo.
    // En producción, esto se reiniciará con el servidor. Para persistencia real se necesita una DB.
    return orderCounter.toString().padStart(6, '0');
}

/**
 * Updates the stock of a product variant in the `src/lib/data.ts` file.
 * NOTE: This file-based update approach is not suitable for a production server
 * environment which is typically read-only. This is for demonstration or specific
 * build-process scenarios.
 * @param {number} productId - The ID of the product to update.
 * @param {string} optionValue - The value of the option (e.g., "S", "M", "L").
 * @param {number} quantity - The quantity to decrement from the stock.
 * @param {string} [colorName] - The name of the color variant, if applicable.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    // Esta función permanecerá vacía en el entorno de producción
    // para evitar errores de escritura en el sistema de archivos.
    // El stock se manejará en memoria a través del store de Zustand.
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    try {
        let fileContent = await fs.readFile(dataFilePath, 'utf-8');
        
        // This is a complex operation and prone to errors.
        // A proper database is recommended for production environments.
        const productRegex = new RegExp(`(id:\\s*${productId},[\\s\\S]*?options:\\s*{[\\s\\S]*?values:\\s*\\[[\\s\\S]*?\\][\\s\\S]*?})`, 'g');
        const productMatch = fileContent.match(productRegex);

        if (!productMatch || productMatch.length === 0) {
            console.warn(`Producto no encontrado en data.ts con ID: ${productId}`);
            return;
        }
        
        // This is a simplified regex and might not cover all edge cases.
        const stockRegex = new RegExp(
            colorName
                ? `(name:\\s*['"\`]${colorName}['"\`][\\s\\S]*?value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`
                : `(value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`
        );

        let updated = false;
        const updatedContent = fileContent.replace(productRegex, (productBlock) => {
            return productBlock.replace(stockRegex, (match, prefix, currentStockStr) => {
                updated = true;
                const currentStock = parseInt(currentStockStr, 10);
                const newStock = Math.max(0, currentStock - quantity);
                return `${prefix}${newStock}`;
            });
        });

        if (updated) {
            await fs.writeFile(dataFilePath, updatedContent, 'utf-8');
            // También actualizamos el contador para persistirlo junto con el stock
            if (orderCounter !== -1) {
              await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
            }
        } else {
            console.warn(`Opción de stock no encontrada para el producto: ${productId} (${optionValue} / ${colorName || 'N/A'})`);
        }
    } catch (error) {
        console.error("Error al intentar actualizar el stock en el archivo:", error);
        // No lanzamos el error para no detener el proceso de compra
    }
}
