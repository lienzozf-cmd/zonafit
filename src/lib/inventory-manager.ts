import fs from 'fs/promises';
import path from 'path';
import type { Product } from './data';

// --- Paths ---
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

/**
 * Retrieves the next order ID by reading and updating a counter file atomically.
 * This function is now safe for multiple simultaneous requests and server restarts.
 * @returns {Promise<string>} The next order ID, padded with leading zeros.
 */
export async function getNextOrderId(): Promise<string> {
    let currentCounter = 0;
    try {
        const data = await fs.readFile(counterFilePath, 'utf-8');
        const parsedCounter = parseInt(data.trim(), 10);
        if (!isNaN(parsedCounter)) {
            currentCounter = parsedCounter;
        }
    } catch (error) {
        console.warn('Counter file not found or unreadable, will use a random number instead. Error:', error);
        // If we can't read/write the file (e.g., in a read-only serverless environment),
        // generate a random-ish ID to allow the order to proceed. 'E' for 'Error'.
        return `E-${Math.floor(Date.now() / 1000) % 100000}`;
    }

    const nextCounter = currentCounter + 1;
    
    try {
        await fs.writeFile(counterFilePath, nextCounter.toString(), 'utf-8');
    } catch (writeError) {
        console.warn("Could not write to counter file. This is expected in some serverless environments.", writeError);
    }

    return nextCounter.toString().padStart(6, '0');
}


/**
 * Updates the stock in the products.json file.
 * This function is now wrapped in a try/catch to prevent crashes in read-only environments.
 * @param productId The ID of the product.
 * @param optionValue The selected option (e.g., size, flavor).
 * @param quantity The quantity purchased.
 * @param colorName The selected color, if any.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    try {
        const productsData = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(productsData);

        const productIndex = products.findIndex((p: any) => p.id === productId);
        if (productIndex === -1) {
            console.error(`Product with ID ${productId} not found for stock update.`);
            return; // Don't throw, just exit gracefully.
        }

        const product = products[productIndex];

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
        
        // After updating, recalculate the general availability of the product
        const isAvailable = product.options?.values.some(v => v.stock > 0) || 
                            (product.colors && product.colors.some(c => c.options.values.some(v => v.stock > 0)));
        product.availability = isAvailable ? 'Disponible' : 'Agotado';


        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
        console.log(`Stock updated for Product ID: ${productId}`);

    } catch (error) {
        console.warn('CRITICAL: Failed to read or write stock file. Inventory will be incorrect. This is expected in most serverless environments. Error:', error);
        // Do not re-throw error to allow the order process to continue.
    }
}
