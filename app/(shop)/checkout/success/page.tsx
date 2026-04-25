'use client'

import { use } from 'react'
import Link from 'next/link'
import { CheckCircle2, Phone, ShoppingBag } from 'lucide-react'

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string; name?: string; method?: string }>
}

const PAYMENT_LABEL: Record<string, string> = {
  credit_card: '💳 Cartão de Crédito (na entrega)',
  debit_card: '🏦 Cartão de Débito (na entrega)',
  pix: '⚡ PIX (a loja enviará a chave)',
  cash: '💵 Espécie',
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { orderId, name, method } = use(searchParams)
  const firstName = name ? decodeURIComponent(name).split(' ')[0] : null
  const paymentLabel = method ? PAYMENT_LABEL[decodeURIComponent(method)] : null

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {/* Ícone animado */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-14 w-14 text-green-500" strokeWidth={1.5} />
      </div>

      {/* Título */}
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        {firstName ? `Pedido feito, ${firstName}! 🎉` : 'Pedido feito! 🎉'}
      </h1>

      <p className="mb-1 text-sm text-gray-500">Recebemos seu pedido com sucesso.</p>
      <p className="mb-6 text-sm text-gray-500">
        Em breve um de nossos atendentes vai entrar em contato para confirmar os detalhes.
      </p>

      {/* Card de detalhes */}
      <div className="mb-8 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {orderId && (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <span className="text-sm text-gray-500">Número do pedido</span>
            <span className="text-sm font-bold text-gray-900">{orderId}</span>
          </div>
        )}
        {paymentLabel && (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <span className="text-sm text-gray-500">Pagamento</span>
            <span className="text-sm font-medium text-gray-900">{paymentLabel}</span>
          </div>
        )}
        <div className="flex items-start gap-3 px-5 py-4">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1565a0]" />
          <p className="text-left text-sm text-gray-600">
            Fique de olho no seu WhatsApp — a loja entrará em contato para confirmar endereço,
            horário e pagamento.
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#1565a0] py-4 text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          <ShoppingBag className="h-4 w-4" />
          Continuar comprando
        </Link>
        <Link
          href="/"
          className="rounded-2xl border border-gray-200 py-3.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
