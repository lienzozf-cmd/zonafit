'use client';
import { type ReactNode, useRef } from 'react';
import { type StoreApi } from 'zustand';
import {
  ProductStoreContext,
  type ProductStore,
  productStore
} from '@/stores/product-store';

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<ProductStore>>();
  if (!storeRef.current) {
    storeRef.current = productStore;
  }

  return (
    <ProductStoreContext.Provider value={storeRef.current}>
      {children}
    </ProductStoreContext.Provider>
  );
};

export default ProductProvider;
