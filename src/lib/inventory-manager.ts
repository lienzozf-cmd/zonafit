
import fs from 'fs/promises';
import path from 'path';

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
