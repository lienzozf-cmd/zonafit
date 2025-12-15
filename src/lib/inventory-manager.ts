import fs from 'fs/promises';
import path from 'path';

// --- Paths ---
const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

// Variable en memoria para el contador, se inicializa una vez.
let orderCounter: number = -1;

/**
 * Retrieves the next order ID by reading from a counter file once,
 * and then managing it in memory and persisting it back to the file.
 * This function is now safe for multiple simultaneous requests.
 * @returns {Promise<string>} The next order ID, padded with leading zeros.
 */
export async function getNextOrderId(): Promise<string> {
    if (orderCounter === -1) {
        try {
            const data = await fs.readFile(counterFilePath, 'utf-8');
            const parsedCounter = parseInt(data.trim(), 10);
            // Si el archivo está vacío o corrupto, empezamos en 0
            orderCounter = isNaN(parsedCounter) ? 0 : parsedCounter;
        } catch (error) {
            console.log('Counter file not found or unreadable, starting from 0.');
            orderCounter = 0; // Si el archivo no existe, empezamos en 0
        }
    }
    
    orderCounter++; // Incrementa el contador en memoria
    
    try {
        // Escribe el nuevo valor de vuelta al archivo para persistencia
        await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
    } catch (writeError) {
        // Si la escritura falla, el contador en memoria seguirá funcionando para la sesión actual
        console.error("Could not write to counter file, continuing without persistence for this session.", writeError);
    }

    // Devuelve el ID formateado
    return orderCounter.toString().padStart(6, '0');
}

/**
 * Updates the stock of a product variant in the `src/lib/data.ts` file atomically.
 * This function now reads the entire file, performs a precise replacement, and writes it back.
 * @param {number} productId - The ID of the product to update.
 * @param {string} optionValue - The value of the option (e.g., "S", "M", "L").
 * @param {number} quantity - The quantity to decrement from the stock.
 * @param {string} [colorName] - The name of the color variant, if applicable.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        let fileContent = await fs.readFile(dataFilePath, 'utf-8');
        
        let updated = false;

        // Regex para encontrar el bloque completo del producto por su ID.
        // Esto asume que cada objeto producto en el array empieza con `{\s*"id":\s*${productId},`
        const productBlockRegex = new RegExp(`(\\{\\s*"id":\\s*${productId},[\\s\\S]*?\\})`, 'm');
        
        let finalContent = fileContent.replace(productBlockRegex, (productBlock) => {
            let tempBlock = productBlock;
            let productUpdatedInBlock = false;

            if (colorName) {
                // Caso con colores: busca el bloque de color y luego la opción de stock dentro de él.
                const colorBlockRegex = new RegExp(`(name:\\s*['"\`]${colorName}['"\`][\\s\\S]*?options:\\s*\\{[\\s\\S]*?values:\\s*\\[[\\s\\S]*?)\\]`, 'm');

                tempBlock = tempBlock.replace(colorBlockRegex, (colorBlock) => {
                    const optionRegex = new RegExp(`(value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`, 'm');
                    return colorBlock.replace(optionRegex, (match, prefix, currentStockStr) => {
                        const currentStock = parseInt(currentStockStr, 10);
                        if (!isNaN(currentStock)) {
                            const newStock = Math.max(0, currentStock - quantity);
                            productUpdatedInBlock = true;
                            return `${prefix}${newStock}`;
                        }
                        return match; // No se pudo parsear, no cambiar nada
                    });
                });

            } else {
                // Caso sin colores: busca la opción de stock directamente en el bloque del producto.
                 const optionRegex = new RegExp(`(value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`, 'm');
                 tempBlock = tempBlock.replace(optionRegex, (match, prefix, currentStockStr) => {
                    const currentStock = parseInt(currentStockStr, 10);
                     if (!isNaN(currentStock)) {
                        const newStock = Math.max(0, currentStock - quantity);
                        productUpdatedInBlock = true;
                        return `${prefix}${newStock}`;
                    }
                    return match;
                 });
            }

            if (productUpdatedInBlock) {
                updated = true;
            }
            return tempBlock; // Devuelve el bloque de producto, modificado o no.
        });

        if (updated) {
            await fs.writeFile(dataFilePath, finalContent, 'utf-8');
            console.log(`Stock updated successfully for product ID: ${productId}, Option: ${optionValue}, Color: ${colorName || 'N/A'}`);
        } else {
            console.warn(`Stock could not be updated. Product or variant not found for ID: ${productId}, Option: ${optionValue}, Color: ${colorName || 'N/A'}`);
        }
    } catch (error) {
        console.error("Critical error in updateStock function:", error);
        throw new Error('Failed to update stock.');
    }
}
