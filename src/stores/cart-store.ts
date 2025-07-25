import { createContext } from 'react';
import { createStore } from 'zustand';
import type { CartItem } from '@/lib/types';
import { useProductStore } from './product-store';

export type CartStore = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
};

const updateTotal = (items: CartItem[]) => ({
  itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
});

export const createCartStore = () =>
  createStore<CartStore>((set, get) => ({
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
          )
      } else {
        newItems = [...get().items, item]
      }
      set({
        items: newItems,
        ...updateTotal(newItems)
      });
    },
    removeItem: (id) => {
      const itemToRemove = get().items.find((i) => i.id === id);
      if (itemToRemove) {
        const [productId, optionValue] = itemToRemove.id.split('-');
        useProductStore.getState().increaseStock(Number(productId), optionValue, itemToRemove.quantity);
      }

      const newItems = get().items.filter((i) => i.id !== id);
      set({
        items: newItems,
        ...updateTotal(newItems)
      });
    },
    incrementQuantity: (id) => {
      const itemToIncrement = get().items.find((i) => i.id === id);
      if (itemToIncrement) {
        const [productId, optionValue] = itemToIncrement.id.split('-');
        const product = useProductStore.getState().products.find(p => p.id === Number(productId));
        const option = product?.options.values.find(o => o.value === optionValue);
        if (option && option.stock > 0) {
            useProductStore.getState().decreaseStock(Number(productId), optionValue);
            const newItems = get().items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            );
            set({
                items: newItems,
                ...updateTotal(newItems)
            });
        }
      }
    },
    decrementQuantity: (id) => {
      const existingItem = get().items.find((i) => i.id === id);
      if (existingItem) {
        const [productId, optionValue] = existingItem.id.split('-');
        useProductStore.getState().increaseStock(Number(productId), optionValue, 1);
      }
      
      let newItems;
      if (existingItem && existingItem.quantity > 1) {
        newItems = get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          )
      } else {
        newItems = get().items.filter((i) => i.id !== id)
      }
      set({
        items: newItems,
        ...updateTotal(newItems)
      });
    },
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  }));

export const CartStoreContext = createContext<ReturnType<typeof createCartStore> | null>(null);
