
'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { products as initialProducts } from '@/lib/data';

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  products: typeof initialProducts;
};

type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
  getAvailableStock: (optionId: string, colorId?: string) => number;
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
  products: initialProducts,

  getItem: (id) => {
    return get().items.find((i) => i.id === id);
  },

  getAvailableStock: (optionId, colorId) => {
    // This logic needs to be robust. For now, we assume it's part of a larger system.
    // This is a placeholder. A real implementation would check against a database.
    return 10; // Placeholder stock
  },

  addItem: (item) => {
    set(produce((draft: CartState) => {
      const existingItem = draft.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        draft.items.push({ ...item, quantity: 1 });
      }
      const newTotals = updateTotal(draft.items);
      draft.itemCount = newTotals.itemCount;
      draft.total = newTotals.total;
    }));
  },
  
  removeItem: (id) => {
    set(produce((draft: CartState) => {
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
    set(produce((draft: CartState) => {
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
    set(produce((draft: CartState) => {
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
  
  clearCart: () => {
    set({
      items: [],
      itemCount: 0,
      total: 0,
    });
  },
}));
