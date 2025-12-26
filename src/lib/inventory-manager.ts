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
        console.log('Counter file not found or unreadable, starting from 0.');
        currentCounter = 0;
    }

    const nextCounter = currentCounter + 1;
    
    try {
        await fs.writeFile(counterFilePath, nextCounter.toString(), 'utf-8');
    } catch (writeError) {
        console.error("Could not write to counter file, which will cause issues on restart.", writeError);
    }

    return nextCounter.toString().padStart(6, '0');
}


/**
 * Updates the stock in the products.json file.
 * This function is called after a successful order.
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
            throw new Error(`Product with ID ${productId} not found.`);
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
        console.error('Error updating stock in inventory-manager:', error);
        // Re-throwing the error is important so the calling function knows something went wrong.
        throw new Error('Failed to update stock file.');
    }
}
