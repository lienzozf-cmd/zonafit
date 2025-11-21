
'use client'

import { type ReactNode, createContext, useRef } from 'react'
import { type StoreApi } from 'zustand'

import { type CartStore, createCartStore } from '@/stores/cart-store'

export const CartStoreContext = createContext<StoreApi<CartStore> | null>(
  null,
)

export interface CartStoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({
  children,
}: CartStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CartStore>>()
  if (!storeRef.current) {
    storeRef.current = createCartStore()
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  )
}
