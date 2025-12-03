
import fs from 'fs/promises';
import path from 'path';
import { products as initialProducts } from './data';
import type { Product } from './data';

let products: Product[] = JSON.parse(JSON.stringify(initialProducts));

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
const counterFilePath = path.join(process.cwd(), 'order-counter.txt');

async function persistProducts(updatedProducts: Product[]): Promise<void> {
    const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
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

async function readCounter(): Promise<number> {
  try {
    const data = await fs.readFile(counterFilePath, 'utf-8');
    return parseInt(data.trim(), 10);
  } catch (error) {
    return 0;
  }
}

async function writeCounter(value: number): Promise<void> {
  await fs.writeFile(counterFilePath, value.toString(), 'utf-8');
}

export async function getNextOrderId(): Promise<string> {
    const currentId = await readCounter();
    const nextId = currentId + 1;
    await writeCounter(nextId);
    return nextId.toString().padStart(6, '0');
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

  await persistProducts(productsCopy);
}

    