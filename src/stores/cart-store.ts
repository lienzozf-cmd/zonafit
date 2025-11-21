
'use client';

import { createStore } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { type Product, type ProductOption } from '@/lib/data';
import { useProductStore } from './product-store';

export type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
};

export type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  isCartOpen: false,
};

const updateTotal = (items: CartItem[]) => ({
  itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
});

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>((set, get) => ({
    ...initState,
    getItem: (id) => {
      return get().items.find((i) => i.id === id);
    },
    addItem: (item) => {
      const { products } = useProductStore.getState();
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      const option = useProductStore.getState().getProductOption(product, item.option, item.color);
      if (!option || option.stock < 1) return;

      set(produce((draft: CartState) => {
        const existingItem = draft.items.find((i) => i.id === item.id);
        if (existingItem) {
          if (option.stock > existingItem.quantity) {
            existingItem.quantity += 1;
          }
        } else {
          draft.items.push({ ...item, quantity: 1 });
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    removeItem: (itemToRemove) => {
      useProductStore.getState().increaseStock([itemToRemove]);
      set(produce((draft: CartState) => {
        draft.items = draft.items.filter((i) => i.id !== itemToRemove.id);
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    incrementQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if(!item) return;

        const { products } = useProductStore.getState();
        const product = products.find(p => p.id === item.productId);
        if(!product) return;
        
        const option = useProductStore.getState().getProductOption(product, item.option, item.color);
        if(!option) return;

        if (option.stock > item.quantity) {
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
    },
    decrementQuantity: (id) => {
      set(produce((draft: CartState) => {
        const item = draft.items.find((i) => i.id === id);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            useProductStore.getState().increaseStock([item]);
            draft.items = draft.items.filter((i) => i.id !== id);
          }
        }
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    clearCart: () => {
      set(produce((draft: CartState) => {
        draft.items = [];
        draft.itemCount = 0;
        draft.total = 0;
      }));
    },
  }));
};
