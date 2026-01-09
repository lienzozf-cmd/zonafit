import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/lib/data';

const productsFilePath = path.join(process.cwd(), 'src/lib', 'products.json');

async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

async function saveProducts(products: Product[]): Promise<void> {
  try {
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(productsFilePath, data, 'utf-8');
  } catch (error) {
    console.error('Error writing products file:', error);
    throw new Error('Could not save products.');
  }
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const updatedProducts: Product[] = await req.json();
    if (!Array.isArray(updatedProducts)) {
        return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }
    await saveProducts(updatedProducts);
    return NextResponse.json(updatedProducts);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error saving products', error: error.message }, { status: 500 });
  }
}
