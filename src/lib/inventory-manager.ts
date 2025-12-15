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
            if (isNaN(orderCounter)) {
              // Handle case where file is empty or corrupt
              orderCounter = 0;
            }
        } catch (error) {
            console.log('Counter file not found or unreadable, starting from 0.');
            orderCounter = 0;
        }
    }
    
    orderCounter++;
    
    try {
        await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
    } catch (writeError) {
        console.error("Could not write to counter file, continuing without persistence for this session.", writeError);
    }

    return orderCounter.toString().padStart(6, '0');
}

/**
 * Updates the stock of a product variant in the `src/lib/data.ts` file.
 * @param {number} productId - The ID of the product to update.
 * @param {string} optionValue - The value of the option (e.g., "S", "M", "L").
 * @param {number} quantity - The quantity to decrement from the stock.
 * @param {string} [colorName] - The name of the color variant, if applicable.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        let fileContent = await fs.readFile(dataFilePath, 'utf-8');
        
        let updated = false;

        // Create a dynamic regex to find the product object
        const productStartRegex = new RegExp(`(\\{\\s*id:\\s*${productId},[\\s\\S]*?\\})`, 'g');
        
        let updatedContent = fileContent.replace(productStartRegex, (productBlock) => {
            let tempBlock = productBlock;
            let productUpdated = false;

            if (colorName) {
                // Regex for color variants
                const colorRegex = new RegExp(`(name:\\s*['"\`]${colorName}['"\`][\\s\\S]*?value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`, 'g');
                tempBlock = tempBlock.replace(colorRegex, (match, prefix, currentStockStr) => {
                    const currentStock = parseInt(currentStockStr, 10);
                    const newStock = Math.max(0, currentStock - quantity);
                    productUpdated = true;
                    return `${prefix}${newStock}`;
                });
            } else {
                // Regex for products without color variants
                const optionRegex = new RegExp(`(value:\\s*['"\`]${optionValue}['"\`][\\s\\S]*?stock:\\s*)(\\d+)`, 'g');
                
                // This check ensures we are not accidentally changing a color's option stock
                // when no color is specified. This is a safeguard.
                if (!/colors: \[[^\]]+\]/.test(productBlock)) {
                     tempBlock = tempBlock.replace(optionRegex, (match, prefix, currentStockStr) => {
                        const currentStock = parseInt(currentStockStr, 10);
                        const newStock = Math.max(0, currentStock - quantity);
                        productUpdated = true;
                        return `${prefix}${newStock}`;
                    });
                }
            }

            if (productUpdated) {
                updated = true;
            }
            return tempBlock;
        });

        if (updated) {
            await fs.writeFile(dataFilePath, updatedContent, 'utf-8');
            console.log(`Stock updated successfully for product ID: ${productId}`);
        } else {
            console.warn(`Stock option not found or not updated for product: ${productId} (Option: ${optionValue}, Color: ${colorName || 'N/A'})`);
        }
    } catch (error) {
        console.error("Error trying to update stock in file:", error);
    }
}
