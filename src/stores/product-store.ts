
'use client';

import { createStore } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';
import type { CartItem } from '@/lib/types';


export type ProductStoreState = {
  products: Product[];
};

export type ProductActions = {
    decreaseStock: (cartItems: CartItem[]) => void;
    increaseStock: (cartItems: CartItem[]) => void;
    getProductOption: (product: Product, optionValue: string, colorName?: string) => ProductOption | undefined;
};

export type ProductStore = ProductStoreState & ProductActions;

export const defaultInitState: ProductStoreState = {
    products: initialProducts,
};

export const createProductStore = (initState: ProductStoreState = defaultInitState) => {
  return createStore<ProductStore>((set, get) => ({
    ...initState,
    getProductOption: (product, optionValue, colorName) => {
        const currentProduct = get().products.find(p => p.id === product.id);
        if (!currentProduct) return undefined;
        
        if (colorName) {
          const color = currentProduct.colors?.find(c => c.name === colorName);
          return color?.options.values.find(v => v.value === optionValue);
        }
        return currentProduct.options.values.find(v => v.value === optionValue);
    },
    decreaseStock: (cartItems) => {
        set(produce((draft: ProductStoreState) => {
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
    increaseStock: (cartItems) => {
        set(produce((draft: ProductStoreState) => {
            cartItems.forEach(item => {
                const product = draft.products.find(p => p.id === item.productId);
                if (!product) return;

                if (item.color) {
                    const color = product.colors?.find(c => c.name === item.color);
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
            })
        }));
    },
  }));
};
