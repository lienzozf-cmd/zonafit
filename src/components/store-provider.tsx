'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi } from 'zustand'

import { type CartStore, createCartStore } from '@/stores/cart-store'
import { useStore } from 'zustand'

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
