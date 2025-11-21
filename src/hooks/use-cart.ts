
'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'
import { CartStoreContext } from '@/components/store-provider'
import { type CartStore } from '@/stores/cart-store'

type Selector<T> = (store: CartStore) => T;

export function useCart<T>(selector: Selector<T>): T;
export function useCart(): CartStore;
export function useCart<T>(selector?: Selector<T>): T | CartStore {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCart must be used within a StoreProvider`)
  }

  return useStore(cartStoreContext, selector as Selector<T>);
}
