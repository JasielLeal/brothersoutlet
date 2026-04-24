'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/features/cart/hooks/useCart'

export function CartItems() {
  const { items, removeItem, updateQuantity } = useCart()

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium">Seu carrinho está vazio</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Adicione produtos para continuar comprando
        </p>
        <Button asChild>
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.product.id}>
          <div className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <Link
                  href={`/product/${item.product.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-muted-foreground hover:text-destructive ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border">
                  <button
                    className="hover:bg-muted p-1.5"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    className="hover:bg-muted p-1.5"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  )
}
