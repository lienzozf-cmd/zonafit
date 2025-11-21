
'use client';

import { create } from 'zustand';
import { Product } from '@/lib/data';

interface CartState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (productId) =>
    set((state) => ({ products: state.products.filter(p => p.id !== productId) })),
}));
