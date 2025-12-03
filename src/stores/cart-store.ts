
'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';

interface AppState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  products: Product[];
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clearCart: () => void;
  processOrder: () => void;
  getProductOption: (productId: number, optionValue: string, colorName?: string) => ProductOption | undefined;
}

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  return { itemCount, total };
};

export const useCartStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isCartOpen: false,
      products: initialProducts,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addItem: (item) => {
        set(produce((state: AppState) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push(item);
            }
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
        }));
      },
      removeItem: (id: string) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const { itemCount, total } = calculateTotals(newItems);
          return { items: newItems, itemCount, total };
        });
      },
      incrementQuantity: (id) => {
        set((state) => {
            const newItems = state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            );
            const { itemCount, total } = calculateTotals(newItems);
            return { items: newItems, itemCount, total };
        });
      },
      decrementQuantity: (id) => {
          set((state) => {
             const newItems = state.items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
            ).filter(i => i.quantity > 0);
            const { itemCount, total } = calculateTotals(newItems);
            return { items: newItems, itemCount, total };
          });
      },
      clearCart: () => {
        set({ items: [], itemCount: 0, total: 0 })
      },
      processOrder: () => {
        const { items, products } = get();
        const newProducts = produce(products, draft => {
          items.forEach(cartItem => {
            const product = draft.find(p => p.id === cartItem.productId);
            if (product) {
              if (cartItem.color && product.colors) {
                const color = product.colors.find(c => c.name === cartItem.color);
                if (color) {
                  const option = color.options.values.find(o => o.value === cartItem.option);
                  if (option) {
                    option.stock = Math.max(0, option.stock - cartItem.quantity);
                  }
                }
              } else {
                const option = product.options.values.find(o => o.value === cartItem.option);
                if (option) {
                  option.stock = Math.max(0, option.stock - cartItem.quantity);
                }
              }
            }
          });
        });
        set({ products: newProducts, items: [], itemCount: 0, total: 0 });
      },
      getProductOption: (productId, optionValue, colorName) => {
        const product = get().products.find(p => p.id === productId);
        if (!product) return undefined;
    
        if (colorName && product.colors) {
            const color = product.colors.find(c => c.name === colorName);
            return color?.options.values.find(o => o.value === optionValue);
        }
    
        return product.options.values.find(o => o.value === optionValue);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage), 
      merge: (persistedState, currentState) => {
        const state = { ...currentState, ...persistedState };
        // Always use the latest product data from the code, not from storage.
        state.products = initialProducts;

        if((persistedState as AppState)?.items){
           state.items = (persistedState as AppState).items;
        } else {
          state.items = [];
        }

        return state;
      },
      onRehydrateStorage: () => (state, error) => {
        if (state) {
            // Recalculate totals on rehydration
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
        }
      }
    }
  )
);
