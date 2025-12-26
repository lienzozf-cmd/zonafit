
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
      products: [], // Initialize with an empty array, will be fetched from server.
      setProducts: (products) => set({ products }),
      fetchProducts: async () => {
        try {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const serverProducts = await response.json();
          set({ products: serverProducts });
        } catch (error) {
          console.error("Failed to fetch latest products:", error);
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
      name: 'cart-storage-v3', // Changed version to clear old storage
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        items: state.items,
        isCartOpen: state.isCartOpen,
        itemCount: state.itemCount,
        total: state.total
      }), // Only persist cart-related items
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log('An error happened during hydration', error)
          } else {
             // We still fetch products, but now it's the ONLY source for product data
             state?.fetchProducts();
          }
        }
      }
    }
  )
);
