
'use client'

import { createStore } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';
import type { CartItem } from '@/lib/types';


export type ProductState = {
  products: Product[];
}

export type ProductActions = {
    decreaseStock: (items: CartItem[]) => void;
    increaseStock: (items: CartItem[]) => void;
    getProductOption: (productId: number, optionValue: string, colorName?: string) => ProductOption | undefined;
}

export type ProductStore = ProductState & ProductActions;

export const defaultInitState: ProductState = {
  products: initialProducts,
}

export const createProductStore = () =>
  createStore<ProductStore>((set, get) => ({
    ...defaultInitState,
    decreaseStock: (items) => {
        set(produce((state: ProductStore) => {
          items.forEach(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
              if (product.colors && item.color) {
                const color = product.colors.find(c => c.name === item.color);
                if (color) {
                  const option = color.options.values.find(o => o.value === item.option);
                  if (option) {
                    option.stock -= item.quantity;
                  }
                }
              } else {
                const option = product.options.values.find(o => o.value === item.option);
                if (option) {
                  option.stock -= item.quantity;
                }
              }
            }
          });
        }));
    },
    increaseStock: (items) => {
        set(produce((state: ProductStore) => {
            items.forEach(item => {
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
    }
  }))
