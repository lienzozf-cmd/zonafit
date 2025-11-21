'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';
import type { CartItem } from '@/lib/types';

export type CartState = {
  products: Product[];
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
};

export type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
  getProductOption: (productId: number, optionValue: string, colorName?: string) => ProductOption | undefined;
};

export type CartStore = CartState & CartActions;

const updateTotal = (items: CartItem[]) => ({
  itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
});

export const useCartStore = create<CartStore>((set, get) => ({
  products: initialProducts,
  items: [],
  itemCount: 0,
  total: 0,
  isCartOpen: false,
  getItem: (id) => {
    return get().items.find((i) => i.id === id);
  },
  getProductOption: (productId, optionValue, colorName) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return undefined;

    if (colorName && product.colors) {
        const color = product.colors.find(c => c.name === colorName);
        return color?.options.values.find(o => o.value === optionValue);
    }

    return product.options.values.find(o => o.value === optionValue);
  },
  addItem: (item) => {
    const option = get().getProductOption(item.productId, item.option, item.color);
    if (!option) return;

    const existingItem = get().getItem(item.id);
    const stockInCart = existingItem?.quantity || 0;

    if (option.stock <= stockInCart) {
        console.error("No hay suficiente stock para añadir al carrito");
        return; 
    }

    set(produce((state: CartStore) => {
        const draftExistingItem = state.items.find((i) => i.id === item.id);
        if (draftExistingItem) {
          draftExistingItem.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        
        const { itemCount, total } = updateTotal(state.items);
        state.itemCount = itemCount;
        state.total = total;
      }));
  },
  removeItem: (id) => {
    set(produce((state: CartStore) => {
      state.items = state.items.filter((i) => i.id !== id);
      const { itemCount, total } = updateTotal(state.items);
      state.itemCount = itemCount;
      state.total = total;
    }));
  },
  incrementQuantity: (id) => {
    const item = get().getItem(id);
    if(!item) return;

    const option = get().getProductOption(item.productId, item.option, item.color);
    if(!option) return;
    
    const stockInCart = item.quantity;

    if (option.stock > stockInCart) {
        set(produce((state: CartStore) => {
            const draftItem = state.items.find((i) => i.id === id);
            if (draftItem) {
                draftItem.quantity += 1;
            }
            const { itemCount, total } = updateTotal(state.items);
            state.itemCount = itemCount;
            state.total = total;
        }));
    }
  },
  decrementQuantity: (id) => {
    set(produce((state: CartStore) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
      const { itemCount, total } = updateTotal(state.items);
      state.itemCount = itemCount;
      state.total = total;
    }));
  },
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  clearCart: () => {
    set(produce((state: CartStore) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
    }));
  },
}));
