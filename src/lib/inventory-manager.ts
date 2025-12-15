import fs from 'fs/promises';
import path from 'path';

// --- Paths ---
const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

/**
 * Retrieves the next order ID by reading, incrementing, and writing to a counter file.
 * This ensures the order ID is persistent across server instances.
 * @returns {Promise<string>} The next order ID, padded with leading zeros.
 */
export async function getNextOrderId(): Promise<string> {
    let currentCounter = 0;
    try {
        const data = await fs.readFile(counterFilePath, 'utf-8');
        currentCounter = parseInt(data.trim(), 10);
    } catch (error) {
        // If the file doesn't exist, we start at 0.
        console.log('Counter file not found, starting from 0.');
    }

    const nextCounter = currentCounter + 1;
    await fs.writeFile(counterFilePath, nextCounter.toString(), 'utf-8');
    
    return nextCounter.toString().padStart(6, '0');
}

/**
 * Updates the stock of a product variant directly in the `src/lib/data.ts` file.
 * This ensures that stock changes are persisted on the filesystem.
 * @param {number} productId - The ID of the product to update.
 * @param {string} optionValue - The value of the option (e.g., "S", "M", "L").
 * @param {number} quantity - The quantity to decrement from the stock.
 * @param {string} [colorName] - The name of the color variant, if applicable.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        let fileContent = await fs.readFile(dataFilePath, 'utf-8');

        // Regex to find the product object by its ID
        const productRegex = new RegExp(`(id:\\s*${productId},[\\s\\S]*?options:\\s*{[\\s\\S]*?values:\\s*\\[[\\s\\S]*?\\][\\s\\S]*?})`, 'g');
        const productMatch = fileContent.match(productRegex);

        if (!productMatch || productMatch.length === 0) {
            throw new Error(`Producto no encontrado en data.ts con ID: ${productId}`);
        }

        let productString = productMatch[0];
        let updatedProductString = productString;

        // Regex to find the specific stock value to update
        // This handles finding the right option within the correct color block or the main options block
        const stockRegex = new RegExp(
            (colorName
                ? `(name:\\s*['|"]${colorName}['|"],[\\s\\S]*?value:\\s*['|"]${optionValue}['|"],[\\s\\S]*?stock:\\s*)(\\d+)`
                : `(value:\\s*['|"]${optionValue}['|"],[\\s\\S]*?stock:\\s*)(\\d+)`
            ), 'g'
        );

        let matchFound = false;
        updatedProductString = productString.replace(stockRegex, (match, prefix, currentStockStr) => {
            matchFound = true;
            const currentStock = parseInt(currentStockStr, 10);
            if (currentStock < quantity) {
                throw new Error(`Stock insuficiente para ${productId} (${optionValue}/${colorName || 'N/A'}). Solicitado: ${quantity}, Disponible: ${currentStock}`);
            }
            const newStock = currentStock - quantity;
            return `${prefix}${newStock}`;
        });

        if (!matchFound) {
            throw new Error(`Opción de stock no encontrada para el producto: ${productId} (${optionValue} / ${colorName || 'N/A'})`);
        }

        fileContent = fileContent.replace(productString, updatedProductString);

        await fs.writeFile(dataFilePath, fileContent, 'utf-8');

    } catch (error) {
        console.error("Error al actualizar el stock en el archivo:", error);
        throw error;
    }
}
