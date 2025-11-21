
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
  getItem: (id: string) => CartItem | undefined;
  decreaseStock: (items: CartItem[]) => void;
  increaseStock: (items: CartItem[]) => void;
  getProductOption: (productId: number, optionValue: string, colorName?: string) => ProductOption | undefined;
}

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
            get().incrementQuantity(item.id);
        } else {
            set((state) => {
                const newItems = [...state.items, { ...item, quantity: 1 }];
                const { itemCount, total } = calculateTotals(newItems);
                get().decreaseStock([{ ...item, quantity: 1 }]);
                return { items: newItems, itemCount, total };
            });
        }
      },
      removeItem: (id: string) => {
        const itemToRemove = get().items.find((i) => i.id === id);
        if (itemToRemove) {
          get().increaseStock([itemToRemove]);
        }
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const { itemCount, total } = calculateTotals(newItems);
          return { items: newItems, itemCount, total };
        });
      },
      incrementQuantity: (id) => {
        const itemToIncrement = get().items.find((i) => i.id === id);
        if (itemToIncrement) {
          get().decreaseStock([{ ...itemToIncrement, quantity: 1 }]);
          set((state) => {
            const newItems = state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            );
            const { itemCount, total } = calculateTotals(newItems);
            return { items: newItems, itemCount, total };
          });
        }
      },
      decrementQuantity: (id) => {
        const itemToDecrement = get().items.find((i) => i.id === id);
         if (itemToDecrement) {
          get().increaseStock([{ ...itemToDecrement, quantity: 1 }]);
          set((state) => {
             const newItems = state.items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
            ).filter(i => i.quantity > 0);
            const { itemCount, total } = calculateTotals(newItems);
            return { items: newItems, itemCount, total };
          });
         }
      },
      clearCart: () => {
        get().increaseStock(get().items);
        set({ items: [], itemCount: 0, total: 0 })
      },
      getItem: (id) => get().items.find((i) => i.id === id),
      decreaseStock: (itemsToDecrease) => {
        set(produce((state: AppState) => {
            itemsToDecrease.forEach(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
              if (product.colors && item.color) {
                const color = product.colors.find(c => c.name === item.color);
                if (color) {
                  const option = color.options.values.find(o => o.value === item.option);
                  if (option) {
                    option.stock = Math.max(0, option.stock - item.quantity);
                  }
                }
              } else {
                const option = product.options.values.find(o => o.value === item.option);
                if (option) {
                  option.stock = Math.max(0, option.stock - item.quantity);
                }
              }
            }
          });
        }));
      },
      increaseStock: (itemsToIncrease) => {
        set(produce((state: AppState) => {
            itemsToIncrease.forEach(item => {
              const product = state.products.find(p => p.id === item.productId);
              if (product) {
                if (product.colors && item.color) {
                    const color = product.colors.find(c => c.name === item.color);
                    if (color) {
                      const option = color.options.values.find(o => o.value === item.option);
                      if (option) {
                        option.stock += item.quantity;
                      }
                    }
                  } else {
                    const option = product.options.values.find(o => o.value === item.option);
                    if (option) {
                      option.stock += item.quantity;
                    }
                  }
              }
            });
        }));
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
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
            
            // On rehydration, we need to reconcile the cart with the product stock.
            // This is a simplified approach. A more robust solution might involve
            // checking if stock is sufficient and notifying the user if not.
            state.decreaseStock(state.items);
        }
      }
    }
  )
);
