'use client'

import { use } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { orderId } = use(searchParams)

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">Pedido confirmado!</h1>
      <p className="text-muted-foreground mb-1">
        Seu pedido foi recebido com sucesso e está sendo processado.
      </p>
      {orderId && (
        <p className="mb-6 text-sm font-medium">
          Número do pedido: <span className="text-primary">{orderId}</span>
        </p>
      )}

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  )
}
