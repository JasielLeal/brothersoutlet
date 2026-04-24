import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/features/cart/types/cart.types'
import type { Product } from '@/features/products/types/product.types'

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find((item) => item.product.id === product.id)

        let updatedItems: CartItem[]
        if (existingItem) {
          updatedItems = items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        } else {
          updatedItems = [...items, { product, quantity }]
        }

        set({ items: updatedItems, ...calculateTotals(updatedItems) })
      },

      removeItem: (productId) => {
        const updatedItems = get().items.filter((item) => item.product.id !== productId)
        set({ items: updatedItems, ...calculateTotals(updatedItems) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        const updatedItems = get().items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        set({ items: updatedItems, ...calculateTotals(updatedItems) })
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 })
      },
    }),
    {
      name: 'cart-store',
    }
  )
)
