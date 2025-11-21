
'use client'

import { useProductStore } from "@/components/store-provider"

export const useProduct = () => {
    const products = useProductStore((state) => state.products)
    const decreaseStock = useProductStore((state) => state.decreaseStock)
    const increaseStock = useProductStore((state) => state.increaseStock)
    const getProductOption = useProductStore((state) => state.getProductOption)

    return {
        products,
        decreaseStock,
        increaseStock,
        getProductOption
    }
}
