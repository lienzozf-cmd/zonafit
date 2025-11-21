
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
      set(produce((draft: CartState) => {
          const existingItem = draft.items.find((i) => i.id === item.id);
          if (draft.items.find((i) => i.id === item.id)) {
            const itemToUpdate = draft.items.find((i) => i.id === item.id)!;
            itemToUpdate.quantity += 1;
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
        draft.items = draft.items.filter((i) => i.id !== id);
        const newTotals = updateTotal(draft.items);
        draft.itemCount = newTotals.itemCount;
        draft.total = newTotals.total;
      }));
    },
    incrementQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if(!item) return;

        const option = get().getProductOption(item.productId, item.option, item.color);
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
      get().decreaseStock(get().items);
      set({ items: [], itemCount: 0, total: 0 });
    },
    decreaseStock: (cartItems) => {
        set(produce((draft: CartState) => {
            cartItems.forEach(item => {
                const product = draft.products.find(p => p.id === item.productId);
                if (!product) return;

                if (item.color) {
                    const color = product.colors?.find(c => c.name === item.color);
                    if (color) {
                        const option = color.options.values.find(o => o.value === item.option);
                        if (option && option.stock >= item.quantity) {
                            option.stock -= item.quantity;
                        }
                    }
                } else {
                    const option = product.options.values.find(o => o.value === item.option);
                    if (option && option.stock >= item.quantity) {
                        option.stock -= item.quantity;
                    }
                }
            })
        }));
    },
  }));
};
