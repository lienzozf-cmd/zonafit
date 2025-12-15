import fs from 'fs/promises';
import path from 'path';

// --- Paths ---
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
            orderCounter = isNaN(parsedCounter) ? 0 : parsedCounter;
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
 * DUMMY updateStock function.
 * The actual stock update logic is now handled inside the cart store (Zustand).
 * This function exists to avoid breaking the checkout process that calls it.
 */
export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
    // This function is intentionally left empty.
    // The state is now managed by the Zustand store in `src/stores/cart-store.ts`.
    // We are no longer writing to the data.ts file.
    console.log(`Bypassing file-based stock update for Product ID: ${productId}. State is managed by Zustand.`);
    return Promise.resolve();
}
