
'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { useProductStore } from './product-store';

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
};

type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
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
    const { decreaseStock } = useProductStore.getState();
    const availableStock = decreaseStock(item.productId, 1, item.option, item.color);

    if (availableStock !== false) {
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
    }
  },
  
  removeItem: (id) => {
    const itemToRemove = get().items.find((i) => i.id === id);
    if (itemToRemove) {
      const { increaseStock } = useProductStore.getState();
      increaseStock(itemToRemove.productId, itemToRemove.quantity, itemToRemove.option, itemToRemove.color);
    }

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
    const item = get().items.find((i) => i.id === id);
    if (item) {
      const { decreaseStock } = useProductStore.getState();
      const availableStock = decreaseStock(item.productId, 1, item.option, item.color);
      if (availableStock !== false) {
        set(produce((draft: CartState) => {
          const draftItem = draft.items.find((i) => i.id === id);
          if (draftItem) {
            draftItem.quantity += 1;
          }
          const newTotals = updateTotal(draft.items);
          draft.itemCount = newTotals.itemCount;
          draft.total = newTotals.total;
        }));
      }
    }
  },

  decrementQuantity: (id) => {
    set(produce((draft: CartState) => {
      const item = draft.items.find((i) => i.id === id);
      if (item) {
        const { increaseStock } = useProductStore.getState();
        increaseStock(item.productId, 1, item.option, item.color);
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          const itemIndex = draft.items.findIndex((i) => i.id === id);
          if (itemIndex > -1) {
            draft.items.splice(itemIndex, 1);
          }
        }
      }
      const newTotals = updateTotal(draft.items);
      draft.itemCount = newTotals.itemCount;
      draft.total = newTotals.total;
    }));
  },

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  clearCart: () => {
    const { items } = get();
    const { increaseStock } = useProductStore.getState();
    items.forEach(item => {
      increaseStock(item.productId, item.quantity, item.option, item.color);
    });
    set({
      items: [],
      itemCount: 0,
      total: 0,
    });
  },
}));
