
import fs from 'fs/promises';
import path from 'path';
import { products as initialProducts } from './data';
import type { Product } from './data';

// Use a "let" para que el array de productos en memoria sea mutable.
let products: Product[] = JSON.parse(JSON.stringify(initialProducts));
let orderCounter: number | null = null;

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

async function initializeCounter(): Promise<void> {
    if (orderCounter === null) {
        try {
            const data = await fs.readFile(counterFilePath, 'utf-8');
            orderCounter = parseInt(data.trim(), 10);
        } catch (error) {
            orderCounter = 0;
        }
    }
}

export async function getNextOrderId(): Promise<string> {
    await initializeCounter();
    orderCounter = (orderCounter ?? 0) + 1;
    await fs.writeFile(counterFilePath, orderCounter.toString(), 'utf-8');
    return orderCounter.toString().padStart(6, '0');
}


export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
  // Crea una copia profunda del array de productos en memoria para modificarlo
  const productsCopy: Product[] = JSON.parse(JSON.stringify(products));

  const product = productsCopy.find(p => p.id === productId);

  if (!product) {
    throw new Error(`Producto no encontrado con ID: ${productId}`);
  }

  let optionToUpdate;

  if (colorName && product.colors) {
    const color = product.colors.find(c => c.name === colorName);
    if (color) {
      optionToUpdate = color.options.values.find(o => o.value === optionValue);
    }
  } else if (product.options) {
    optionToUpdate = product.options.values.find(o => o.value === optionValue);
  }

  if (!optionToUpdate) {
    throw new Error(`Opción no encontrada para el producto: ${productId} (${optionValue} / ${colorName || 'N/A'})`);
  }

  if (optionToUpdate.stock < quantity) {
    throw new Error(`Stock insuficiente para ${product.name} (${optionValue} / ${colorName || 'N/A'}). Solicitado: ${quantity}, Disponible: ${optionToUpdate.stock}`);
  }

  optionToUpdate.stock -= quantity;
  
  // Actualiza el array en memoria con la copia modificada
  products = productsCopy;
}
