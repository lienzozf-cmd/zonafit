
'use client';

import { createStore } from 'zustand';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';

export type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  products: Product[];
};

export type CartActions = {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
  getProductOption: (productId: number, optionValue: string, colorName?: string) => ProductOption | undefined;
  decreaseStock: (cartItems: CartItem[]) => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  isCartOpen: false,
  products: initialProducts,
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
    getProductOption: (productId, optionValue, colorName) => {
        const product = get().products.find(p => p.id === productId);
        if (!product) return undefined;
        
        if (colorName) {
          const color = product.colors?.find(c => c.name === colorName);
          return color?.options.values.find(v => v.value === optionValue);
        }
        return product.options.values.find(v => v.value === optionValue);
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

        const option = get().getProductOption(item.productId, item.option, item.color);
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
        get().decreaseStock(get().items);
        set(produce((state: CartStore) => {
            state.items = [];
            state.itemCount = 0;
            state.total = 0;
        }));
    },
    decreaseStock: (cartItems) => {
        set(produce((state: CartStore) => {
            cartItems.forEach(item => {
                const product = state.products.find(p => p.id === item.productId);
                if (!product) return;

                const optionSource = item.color 
                    ? product.colors?.find(c => c.name === item.color)?.options.values 
                    : product.options.values;

                if (optionSource) {
                    const option = optionSource.find(o => o.value === item.option);
                    if (option && option.stock >= item.quantity) {
                        option.stock -= item.quantity;
                    }
                }
            });
        }));
    },
  }));
};
