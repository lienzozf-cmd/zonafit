'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';

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
  getItem: (id: string) => CartItem | undefined;
};

export type CartStore = CartState & CartActions;

const updateTotal = (items: CartItem[]) => ({
  itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
});

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  itemCount: 0,
  total: 0,
  isCartOpen: false,
  getItem: (id) => {
    return get().items.find((i) => i.id === id);
  },
  addItem: (item) => {
    set(produce((state: CartStore) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
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
    set(produce((state: CartStore) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
          item.quantity += 1;
      }
      const { itemCount, total } = updateTotal(state.items);
      state.itemCount = itemCount;
      state.total = total;
    }));
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
