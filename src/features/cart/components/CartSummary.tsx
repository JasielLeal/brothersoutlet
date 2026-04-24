'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/features/cart/hooks/useCart'

export function CartSummary() {
  const { items, total, itemCount, isEmpty } = useCart()

  const shipping = total > 299 ? 0 : 29.9
  const finalTotal = total + shipping

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-lg font-semibold">Resumo do pedido</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
          </span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frete</span>
          <span className={shipping === 0 ? 'font-medium text-green-600' : ''}>
            {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
          </span>
        </div>

        {shipping === 0 && (
          <p className="text-xs text-green-600">✓ Frete grátis em compras acima de R$ 299</p>
        )}

        {total < 299 && (
          <p className="text-muted-foreground text-xs">
            Adicione {formatCurrency(299 - total)} para ganhar frete grátis
          </p>
        )}

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-lg">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      <Button className="mt-6 w-full" size="lg" disabled={isEmpty} asChild={!isEmpty}>
        {isEmpty ? <span>Finalizar compra</span> : <Link href="/checkout">Finalizar compra</Link>}
      </Button>

      <Button variant="outline" className="mt-2 w-full" size="sm" asChild>
        <Link href="/">Continuar comprando</Link>
      </Button>
    </div>
  )
}
