import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho',
}

import { CartItems } from '@/features/cart/components/CartItems'
import { CartSummary } from '@/features/cart/components/CartSummary'

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Meu Carrinho</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
