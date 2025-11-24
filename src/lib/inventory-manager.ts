
import fs from 'fs/promises';
import path from 'path';

// This is an in-memory representation. In a real app, this would be a database.
import { products as initialProducts } from './data';
import type { Product } from './data';

let products: Product[] = initialProducts;

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
        nextCount = 10;
    }
    await fs.writeFile(counterPath, nextCount.toString(), 'utf-8');
    // Format to 6 digits with leading zeros
    return nextCount.toString().padStart(6, '0');
}


export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
  const product = products.find(p => p.id === productId);

  if (!product) {
    throw new Error(`Producto no encontrado con ID: ${productId}`);
  }

  let optionToUpdate;

  if (colorName && product.colors) {
    const color = product.colors.find(c => c.name === colorName);
    if (color) {
      optionToUpdate = color.options.values.find(o => o.value === optionValue);
    }
  } else if (!colorName) {
    optionToUpdate = product.options.values.find(o => o.value === optionValue);
  }

  if (!optionToUpdate) {
    throw new Error(`Opción no encontrada para el producto: ${productId} (${optionValue} / ${colorName})`);
  }

  if (optionToUpdate.stock < quantity) {
    throw new Error(`Stock insuficiente para ${product.name} (${optionValue} / ${colorName}). Solicitado: ${quantity}, Disponible: ${optionToUpdate.stock}`);
  }

  optionToUpdate.stock -= quantity;

  // This is a mock implementation. In a real app, you would save this to a database.
  // For this project, we don't need to persist the data beyond server restart.
}
