
'use client';

import { create } from 'zustand';
import { produce } from 'immer';
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
  clearCart: (restock?: boolean) => void;
  getItem: (id: string) => CartItem | undefined;
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
  
  getItem: (id) => {
    return get().items.find((i) => i.id === id);
  },

  addItem: (item) => {
    set(produce((draft: CartState & CartActions) => {
        const existingItem = draft.items.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          draft.items.push(item);
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
    }));
  },
  
  removeItem: (id) => {
    set(produce((draft: CartState & CartActions) => {
        const itemIndex = draft.items.findIndex((i) => i.id === id);
        if (itemIndex > -1) {
            draft.items.splice(itemIndex, 1);
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
    }));
  },

  incrementQuantity: (id) => {
    set(produce((draft: CartState & CartActions) => {
        const item = draft.items.find((i) => i.id === id);
        if (item) {
          item.quantity += 1;
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
    }));
  },

  decrementQuantity: (id) => {
    set(produce((draft: CartState & CartActions) => {
        const item = draft.items.find((i) => i.id === id);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        } else if (item) {
            const itemIndex = draft.items.findIndex((i) => i.id === id);
            if (itemIndex > -1) {
                draft.items.splice(itemIndex, 1);
            }
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
    }));
  },

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  clearCart: (restock = true) => {
    const { items } = get();
    // This function will be called on successful checkout, so we just clear the cart.
    // The actual stock should be managed server-side in a real application.
    // For this client-side only app, we're not restocking on checkout completion.
    set({
      items: [],
      itemCount: 0,
      total: 0,
    });
  },
}));
