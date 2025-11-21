
'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'
import { CartStoreContext } from '@/components/store-provider'
import { type CartStore } from '@/stores/cart-store'

// Overload for when a selector is provided
export function useCart<T>(
  selector: (store: CartStore) => T,
): T
// Overload for when no selector is provided
export function useCart(): CartStore
// Implementation
export function useCart<T>(selector?: (store: CartStore) => T): T | CartStore {
    const cartStoreContext = useContext(CartStoreContext)

    if (!cartStoreContext) {
        throw new Error('useCart must be used within a StoreProvider')
    }
  
    if (selector) {
      return useStore(cartStoreContext, selector);
    }
  
    return useStore(cartStoreContext);
}
