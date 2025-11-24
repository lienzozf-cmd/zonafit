
import fs from 'fs/promises';
import path from 'path';
import { products } from './data'; // Assuming products are defined here

// Helper to get and increment the order ID from a file
export async function getNextOrderId(): Promise<string> {
    const counterPath = path.join(process.cwd(), 'order-counter.txt');
    let nextCount;
    try {
        const currentCountStr = await fs.readFile(counterPath, 'utf-8');
        const currentCount = parseInt(currentCountStr.trim(), 10);
        nextCount = currentCount + 1;
    } catch (error) {
        // If file doesn't exist or is empty, start from 1
        nextCount = 1;
    }
    await fs.writeFile(counterPath, nextCount.toString(), 'utf-8');
    // Format to 6 digits with leading zeros
    return nextCount.toString().padStart(6, '0');
}


// Helper to update stock in the data store (this is a mock, replace with actual DB logic)
export async function updateStock(productId: number, optionValue: string, colorName: string | undefined | null, quantitySold: number) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.warn(`Product with ID "${productId}" not found for stock update.`);
        return;
    }

    let optionToUpdate;

    if (colorName && product.colors) {
        const color = product.colors.find(c => c.name === colorName);
        if (color) {
            optionToUpdate = color.options.values.find(o => o.value === optionValue);
        }
    } else {
        optionToUpdate = product.options.values.find(o => o.value === optionValue);
    }

    if (optionToUpdate) {
        optionToUpdate.stock -= quantitySold;
        if (optionToUpdate.stock < 0) {
            console.warn(`Stock for product ${productId} (${optionValue}/${colorName || ''}) went negative. Setting to 0.`);
            optionToUpdate.stock = 0;
        }
        // In a real app, you would save this change back to your database.
        // For this example, we are modifying the in-memory object.
    } else {
        console.warn(`Stock option "${optionValue}" for product ID "${productId}" (Color: ${colorName}) not found.`);
    }
}

    