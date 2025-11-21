
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type CartStore, createCartStore } from '@/stores/cart-store'
import { type ProductStore, createProductStore } from '@/stores/product-store'

export const CartStoreContext = createContext<StoreApi<CartStore> | null>(null)
export const ProductStoreContext = createContext<StoreApi<ProductStore> | null>(null)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const cartStoreRef = useRef<StoreApi<CartStore>>()
  const productStoreRef = useRef<StoreApi<ProductStore>>()
  
  if (!cartStoreRef.current) {
    cartStoreRef.current = createCartStore()
  }
  if (!productStoreRef.current) {
    productStoreRef.current = createProductStore()
  }

  return (
    <CartStoreContext.Provider value={cartStoreRef.current}>
        <ProductStoreContext.Provider value={productStoreRef.current}>
            {children}
        </ProductStoreContext.Provider>
    </CartStoreContext.Provider>
  )
}

export const useCartStore = () => {
    const cartStoreContext = useContext(CartStoreContext)

    if (!cartStoreContext) {
        throw new Error('useCartStore must be used within a StoreProvider')
    }

    return useStore(cartStoreContext)
}

export const useProductStore = () => {
    const productStoreContext = useContext(ProductStoreContext)

    if (!productStoreContext) {
        throw new Error('useProductStore must be used within a StoreProvider')
    }

    return useStore(productStoreContext)
}
