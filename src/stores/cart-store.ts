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
          const item = get().getItem(id);
          if(!item) return;
  
          const { getProductOption } = productStore.getState();
          const option = getProductOption(item.productId, item.option, item.color);

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
          const { decreaseStock } = productStore.getState();
          decreaseStock(get().items);
          set(defaultInitState);
      },
  }));
}
