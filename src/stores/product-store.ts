
import { create } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product } from '@/lib/data';

export type ProductStore = {
  products: Product[];
};

export const useProductStore = create<ProductStore>(() => ({
  products: initialProducts,
}));
