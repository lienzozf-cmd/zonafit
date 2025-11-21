'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type CartStore, createCartStore } from '@/stores/cart-store'
import { type ProductStore, createProductStore } from '@/stores/product-store'

export const ProductStoreContext = createContext<StoreApi<ProductStore> | null>(null);
export const CartStoreContext = createContext<StoreApi<CartStore> | null>(null)

export const StoreProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const productStoreRef = useRef<StoreApi<ProductStore>>()
  const cartStoreRef = useRef<StoreApi<CartStore>>()

  if (!productStoreRef.current) {
    productStoreRef.current = createProductStore()
  }

  if (!cartStoreRef.current) {
    cartStoreRef.current = createCartStore(productStoreRef.current.getState)
  }

  return (
    <ProductStoreContext.Provider value={productStoreRef.current}>
        <CartStoreContext.Provider value={cartStoreRef.current}>
        {children}
        </CartStoreContext.Provider>
    </ProductStoreContext.Provider>
  )
}

export const useProductStore = <T,>(
  selector: (store: ProductStore) => T,
): T => {
  const productStoreContext = useContext(ProductStoreContext)

  if (!productStoreContext) {
    throw new Error(`useProductStore must be used within a StoreProvider`)
  }

  return useStore(productStoreContext, selector)
}

export const useCartStore = <T,>(
  selector: (store: CartStore) => T,
): T => {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCartStore must be used within a StoreProvider`)
  }

  return useStore(cartStoreContext, selector)
}
