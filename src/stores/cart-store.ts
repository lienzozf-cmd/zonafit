import { createContext } from 'react';
import { createStore } from 'zustand';
import type { CartItem } from '@/lib/types';

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

export const createCartStore = () =>
  createStore<CartStore>((set, get) => ({
    items: [],
    itemCount: 0,
    total: 0,
    isCartOpen: false,
    addItem: (item) => {
      const existingItem = get().items.find((i) => i.id === item.id);
      if (existingItem) {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      } else {
        set((state) => ({
          items: [...state.items, item],
        }));
      }
      set((state) => ({
        itemCount: state.items.reduce((acc, i) => acc + i.quantity, 0),
        total: state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      }));
    },
    removeItem: (id) => {
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
      set((state) => ({
        itemCount: state.items.reduce((acc, i) => acc + i.quantity, 0),
        total: state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      }));
    },
    incrementQuantity: (id) => {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
       set((state) => ({
        itemCount: state.items.reduce((acc, i) => acc + i.quantity, 0),
        total: state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      }));
    },
    decrementQuantity: (id) => {
      const existingItem = get().items.find((i) => i.id === id);
      if (existingItem && existingItem.quantity > 1) {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          ),
        }));
      } else {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      }
      set((state) => ({
        itemCount: state.items.reduce((acc, i) => acc + i.quantity, 0),
        total: state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      }));
    },
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  }));

export const CartStoreContext = createContext<ReturnType<typeof createCartStore> | null>(null);
