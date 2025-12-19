
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

const calculateTotals = (items: CartItem[], products: Product[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    const originalPrice = product?.originalPrice ? parseFloat(product.originalPrice.replace('Q.', '')) : item.price;
    return acc + (originalPrice * item.quantity);
  }, 0);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  
  return { itemCount, total, subtotal };
};

export const useCartStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isCartOpen: false,
      products: [], // Initialize with an empty array
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
          // In case of error, the product list will remain empty or as it was.
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
            
            const { itemCount, total } = calculateTotals(state.items, state.products);
            state.itemCount = itemCount;
            state.total = total;
        }));
      },
      removeItem: (id: string) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const { itemCount, total } = calculateTotals(newItems, state.products);
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

            const { itemCount, total } = calculateTotals(state.items, state.products);
            state.itemCount = itemCount;
            state.total = total;
        }));
      },
      decrementQuantity: (id) => {
          set((state) => {
             const newItems = state.items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
            ).filter(i => i.quantity > 0);
            const { itemCount, total } = calculateTotals(newItems, state.products);
            return { items: newItems, itemCount, total };
          });
      },
      clearCart: () => {
        set({ items: [], itemCount: 0, total: 0 })
      },
      processOrder: () => {
        const orderedItems = get().items;
        set(produce((state: AppState) => {
            orderedItems.forEach(item => {
                const product = state.products.find(p => p.id === item.productId);
                if (!product) return;

                if (item.color && product.colors) {
                    const color = product.colors.find(c => c.name === item.color);
                    if (color) {
                        const option = color.options.values.find(o => o.value === item.option);
                        if (option) option.stock = Math.max(0, option.stock - item.quantity);
                    }
                } else if (product.options) {
                    const option = product.options.values.find(o => o.value === item.option);
                    if (option) option.stock = Math.max(0, option.stock - item.quantity);
                }
            });
            
            // Reset cart
            state.items = [];
            state.itemCount = 0;
            state.total = 0;
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
      name: 'cart-storage-v2',
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log('An error happened during hydration', error)
          } else {
             state?.fetchProducts();
          }
        }
      }
    }
  )
);
