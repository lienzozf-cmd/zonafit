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
  setProducts: (products: Product[]) => void;
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
      setProducts: (products) => set({ products }),
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
        const { items } = get();
        
        const updatedProducts = produce(get().products, draft => {
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
                } else if (product.options) {
                  const option = product.options.values.find(o => o.value === cartItem.option);
                  if (option) {
                    option.stock = Math.max(0, option.stock - cartItem.quantity);
                  }
                }
              }
            });
        });
      
        // Optimistically update the local state
        set({ products: updatedProducts, items: [], itemCount: 0, total: 0 });

        // Asynchronously update the backend
        fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProducts),
        }).catch(error => {
            console.error('Failed to sync stock with backend:', error);
            // Here you could implement a retry mechanism or notify the user/admin
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
      name: 'cart-storage-v2',
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log('An error happened during hydration', error)
          } else {
             // Fetch the latest products from the server upon rehydration
             fetch('/api/products')
                .then(res => res.json())
                .then(serverProducts => {
                    state?.setProducts(serverProducts);
                })
                .catch(err => console.error("Failed to fetch latest products on rehydration:", err));
          }
        }
      }
    }
  )
);
