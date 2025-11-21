
'use client';

import { createStore, type StoreApi } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import type { ProductStore } from './product-store';

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

export const createCartStore = (productStore: StoreApi<ProductStore>) => {
  return createStore<CartStore>((set, get) => ({
    ...defaultInitState,
    getItem: (id) => {
      return get().items.find((i) => i.id === id);
    },
    addItem: (item) => {
      set(produce((draft: CartState) => {
        const { getProductOption } = productStore.getState();
        const product = productStore.getState().products.find(p => p.id === item.productId);
        if (!product) return;

        const option = getProductOption(product, item.option, item.color);
        if (!option) return;

        const existingItem = draft.items.find((i) => i.id === item.id);
        const stockInCart = existingItem?.quantity || 0;
        
        if (option.stock > stockInCart) {
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            draft.items.push({ ...item, quantity: 1 });
          }
        }
        
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    removeItem: (id) => {
      set(produce((draft: CartState) => {
        draft.items = draft.items.filter((i) => i.id !== id);
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    incrementQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if(!item) return;

        const { getProductOption } = productStore.getState();
        const product = productStore.getState().products.find(p => p.id === item.productId);
        if(!product) return;
        
        const option = getProductOption(product, item.option, item.color);
        if(!option) return;
        
        const stockInCart = item.quantity;

        if (option.stock > stockInCart) {
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
      productStore.getState().decreaseStock(get().items);

      set(produce((draft: CartState) => {
        draft.items = [];
        draft.itemCount = 0;
        draft.total = 0;
      }));
    },
  }));
};
