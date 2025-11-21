
'use client';

import { create } from 'zustand';
import type { CartItem } from '@/lib/types';
import { useProductStore } from './product-store';

export type CartState = {
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
};

const updateTotal = (items: CartItem[]) => ({
  itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
});

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  items: [],
  itemCount: 0,
  total: 0,
  isCartOpen: false,
  addItem: (item) => {
    const existingItem = get().items.find((i) => i.id === item.id);
    let newItems;
    if (existingItem) {
      newItems = get().items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...get().items, item];
    }
    set({
      items: newItems,
      ...updateTotal(newItems),
    });
  },
  removeItem: (id) => {
    const itemToRemove = get().items.find((i) => i.id === id);
    if (itemToRemove) {
      const [productIdStr, color, optionValue] = itemToRemove.id.split('-');
      const productId = parseInt(productIdStr, 10);
      if (!isNaN(productId) && color && optionValue) {
        useProductStore
          .getState()
          .increaseStock(
            productId,
            color,
            optionValue,
            itemToRemove.quantity
          );
      }
    }

    const newItems = get().items.filter((i) => i.id !== id);
    set({
      items: newItems,
      ...updateTotal(newItems),
    });
  },
  incrementQuantity: (id) => {
    const itemToIncrement = get().items.find((i) => i.id === id);
    if (itemToIncrement) {
      const [productIdStr, color, optionValue] = itemToIncrement.id.split('-');
      const productId = parseInt(productIdStr, 10);
      useProductStore.getState().decreaseStock(productId, color, optionValue, 1);
      const newItems = get().items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      set({
        items: newItems,
        ...updateTotal(newItems),
      });
    }
  },
  decrementQuantity: (id) => {
    const existingItem = get().items.find((i) => i.id === id);
    if (existingItem) {
        const [productIdStr, color, optionValue] = existingItem.id.split('-');
        const productId = parseInt(productIdStr, 10);
        useProductStore.getState().increaseStock(productId, color, optionValue, 1);
    }

    let newItems;
    if (existingItem && existingItem.quantity > 1) {
      newItems = get().items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    } else {
      newItems = get().items.filter((i) => i.id !== id);
    }
    set({
      items: newItems,
      ...updateTotal(newItems),
    });
  },
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  clearCart: () => {
    get().items.forEach((item) => {
      const [productIdStr, color, optionValue] = item.id.split('-');
      const productId = parseInt(productIdStr, 10);
      if (!isNaN(productId) && color && optionValue) {
        useProductStore
          .getState()
          .increaseStock(productId, color, optionValue, item.quantity);
      }
    });

    set({
      items: [],
      itemCount: 0,
      total: 0,
    });
  },
}));
