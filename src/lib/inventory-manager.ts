
import fs from 'fs/promises';
import path from 'path';
import { products as initialProducts } from './data';
import type { Product } from './data';

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

async function persistProducts(updatedProducts: Product[]): Promise<void> {
    try {
        const originalFileContent = await fs.readFile(dataFilePath, 'utf-8');
        const productsArrayString = JSON.stringify(updatedProducts, null, 2);

        const regex = /(export const products: Product\[] = )(\[[\s\S]*?\];)/;
        
        if (!regex.test(originalFileContent)) {
             throw new Error("Regex failed to match the products array in data.ts. Inventory not updated.");
        }

        const newFileContent = originalFileContent.replace(
            regex,
            `$1${productsArrayString};`
        );

        await fs.writeFile(dataFilePath, newFileContent, 'utf-8');
        
        products = updatedProducts;
    } catch (error) {
        console.error("Failed to persist inventory update:", error);
        throw new Error("Server error while updating inventory data.");
    }
}


export async function getNextOrderId(): Promise<string> {
    await initializeCounter();
    orderCounter = (orderCounter ?? 0) + 1;
    return orderCounter.toString().padStart(6, '0');
}


export async function updateStock(productId: number, optionValue: string, quantity: number, colorName?: string): Promise<void> {
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
  
  await initializeCounter();
  await fs.writeFile(counterFilePath, (orderCounter ?? 0).toString(), 'utf-8');

  await persistProducts(productsCopy);
}
