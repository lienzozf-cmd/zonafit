
'use client'

import { useProductStore } from "@/components/store-provider"
import type { Product, ProductOption } from "@/lib/data"
import type { CartItem } from "@/lib/types"

export const useProduct = () => {
    const products = useProductStore((state) => state.products)
    const decreaseStock = useProductStore((state) => state.decreaseStock)
    const increaseStock = useProductStore((state) => state.increaseStock)
    const getProductOption = (product: Product, optionValue: string, colorName?: string): ProductOption | undefined => {
        const currentProduct = products.find(p => p.id === product.id);
        if (!currentProduct) return undefined;
        
        if (colorName) {
          const color = currentProduct.colors?.find(c => c.name === colorName);
          return color?.options.values.find(v => v.value === optionValue);
        }
        return currentProduct.options.values.find(v => v.value === optionValue);
    }

    return {
        products,
        decreaseStock,
        increaseStock,
        getProductOption
    }
}
