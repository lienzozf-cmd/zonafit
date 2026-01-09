
'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { CartItem } from '@/lib/types';
import { type Product, type ProductOption } from '@/lib/data';

interface AppState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  products: Product[];
  sessionId: string;
  setSessionId: (id: string) => void;
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
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
      products: [],
      sessionId: '', 
      setSessionId: (id: string) => set({ sessionId: id }),
      setProducts: (products) => set({ products }),
      fetchProducts: async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
            : 'http://localhost:9000';
          const response = await fetch(`${baseUrl}/api/products`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const products = await response.json();
          set({ products });
        } catch (error) {
          console.error("Failed to fetch products:", error);
          set({ products: [] });
        }
      },
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addItem: (item) => {
        set(produce((state: AppState) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            
            const productOption = get().getProductOption(item.productId, item.option, item.color);
            const availableStock = productOption?.stock ?? 0;
            const currentQuantityInCart = existingItem?.quantity ?? 0;

            if (currentQuantityInCart < availableStock) {
              if (existingItem) {
                  existingItem.quantity += 1;
              } else {
                  state.items.push(item);
              }
            } else {
              console.warn(`Cannot add more of ${item.name}. Stock limit reached.`);
              return; 
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
        set(produce((state: AppState) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return;

            const productOption = get().getProductOption(item.productId, item.option, item.color);
            const availableStock = productOption?.stock ?? 0;
            
            if (item.quantity < availableStock) {
              item.quantity += 1;
            } else {
              console.warn(`Cannot increment quantity for ${item.name}. Stock limit reached.`);
              return;
            }

            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
        }));
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
        get().fetchProducts();
        set({
          items: [],
          itemCount: 0,
          total: 0,
        });
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
      name: 'cart-storage-v4',
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        items: state.items,
        isCartOpen: state.isCartOpen,
        itemCount: state.itemCount,
        total: state.total,
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: (state) => {
        return (restoredState, error) => {
          if (error) {
            console.log('An error happened during hydration', error)
          } else {
            if (restoredState && !restoredState.sessionId) {
              const newId = Math.random().toString(36).substring(2, 11);
              restoredState.setSessionId(newId);
            }
            // Fetch fresh product data on rehydration
            get().fetchProducts();
          }
        }
      }
    }
  )
);
