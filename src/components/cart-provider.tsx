'use client';
import { type ReactNode, useRef } from 'react';
import { type StoreApi } from 'zustand';
import { CartStoreContext, type CartStore, cartStore } from '@/stores/cart-store';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<CartStore>>();
  if (!storeRef.current) {
    storeRef.current = cartStore;
  }

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>;
};

export default CartProvider;
