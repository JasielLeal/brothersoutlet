'use client'

import { useState, useRef, useEffect } from 'react'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import {
  Loader2,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  Package,
} from 'lucide-react'

const PAGE_SIZE = 5
import { useAdminOrders, useUpdateOrderStatus } from '@/features/orders/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import type { Order, OrderStatus } from '@/features/orders/types/order.types'

/* ── status config ─────────────────────────────────────── */
const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pendente',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-400',
    icon: Clock,
  },
  processing: {
    label: 'Processando',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    icon: ShoppingBag,
  },
  shipped: {
    label: 'Enviado',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    dot: 'bg-purple-500',
    icon: Truck,
  },
  delivered: {
    label: 'Entregue',
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelado',
    bg: 'bg-red-50',
    text: 'text-red-500',
    dot: 'bg-red-400',
    icon: XCircle,
  },
}

const FILTER_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'delivered', label: 'Concluídos' },
  { key: 'cancelled', label: 'Cancelados' },
]

/* ── status badge ──────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

/* ── order detail drawer ───────────────────────────────── */
function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

  const canConfirm = order.status === 'pending' || order.status === 'processing'
  const canCancel = order.status !== 'cancelled' && order.status !== 'delivered'

  function handleConfirm() {
    const next: OrderStatus =
      order.status === 'pending'
        ? 'processing'
        : order.status === 'processing'
          ? 'shipped'
          : order.status === 'shipped'
            ? 'delivered'
            : order.status
    updateStatus({ id: order.id, status: next }, { onSuccess: onClose })
  }

  function handleCancel() {
    updateStatus({ id: order.id, status: 'cancelled' }, { onSuccess: onClose })
  }

  const nextLabel =
    order.status === 'pending'
      ? 'Confirmar pedido'
      : order.status === 'processing'
        ? 'Marcar como Enviado'
        : order.status === 'shipped'
          ? 'Marcar como Entregue'
          : ''

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />

      {/* drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4A6CF7]/10">
              <Package className="h-4 w-4 text-[#4A6CF7]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{order.id}</p>
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* body — scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* status */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Status
            </p>
            <StatusBadge status={order.status} />
          </div>

          {/* items */}
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Itens do pedido
            </p>
            <div className="divide-y divide-gray-50 rounded-xl bg-gray-50/70 px-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* total */}
          <div className="flex items-center justify-between rounded-xl bg-[#4A6CF7]/5 px-4 py-3">
            <p className="text-sm font-semibold text-gray-700">Total</p>
            <p className="text-base font-bold text-[#4A6CF7]">{formatCurrency(order.total)}</p>
          </div>

          {/* shipping */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Endereço de entrega
            </p>
            <div className="flex items-start gap-2 rounded-xl bg-gray-50/70 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city} — {order.shippingAddress.state},{' '}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* updated */}
          <p className="text-xs text-gray-400">Última atualização: {formatDate(order.updatedAt)}</p>
        </div>

        {/* actions footer */}
        {(canConfirm || canCancel) && (
          <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4">
            {canConfirm && nextLabel && (
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A6CF7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a5ce5] disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {nextLabel}
              </button>
            )}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Cancelar pedido
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

/* ── stats carousel (mobile-only infinite) ──────────────── */
type StatItem = { label: string; value: number; accent: string }

function StatsCarousel({ stats }: { stats: StatItem[] }) {
  const n = stats.length
  const extended = [stats[n - 1], ...stats, stats[0]]
  const [idx, setIdx] = useState(1)
  const [animated, setAnimated] = useState(true)
  const touchX = useRef(0)

  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 20)
      return () => clearTimeout(t)
    }
  }, [animated])

  useEffect(() => {
    if (idx === 0) {
      const t = setTimeout(() => {
        setAnimated(false)
        setIdx(n)
      }, 350)
      return () => clearTimeout(t)
    }
    if (idx === n + 1) {
      const t = setTimeout(() => {
        setAnimated(false)
        setIdx(1)
      }, 350)
      return () => clearTimeout(t)
    }
  }, [idx, n])

  const dot = idx === 0 ? n - 1 : idx === n + 1 ? 0 : idx - 1

  return (
    <div
      className="overflow-hidden"
      onTouchStart={(e) => {
        touchX.current = e.targetTouches[0].clientX
      }}
      onTouchEnd={(e) => {
        const diff = touchX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) setIdx((i) => i + (diff > 0 ? 1 : -1))
      }}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(calc(-${idx * 100}%))`,
          transition: animated ? 'transform 0.35s ease' : 'none',
        }}
      >
        {extended.map((s, i) => (
          <div key={i} className="w-full shrink-0">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
              <div className="mt-3 h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {stats.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAnimated(true)
              setIdx(i + 1)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dot === i ? 'w-4 bg-[#4A6CF7]' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ── page ──────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders()
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [page, setPage] = useState(1)

  const filtered =
    activeFilter === 'all' ? orders : orders?.filter((o) => o.status === activeFilter)

  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE))
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  /* stats */
  const total = orders?.length ?? 0
  const pending = orders?.filter((o) => o.status === 'pending').length ?? 0
  const delivered = orders?.filter((o) => o.status === 'delivered').length ?? 0

  const stats = [
    { label: 'Total de Pedidos', value: total, accent: '#4A6CF7' },
    { label: 'Pendentes', value: pending, accent: '#F5A623' },
    { label: 'Entregues', value: delivered, accent: '#22C55E' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <MobileMenuButton />
        <h1 className="text-xl font-bold text-gray-800">Pedidos</h1>
      </div>

      {/* ── stats row ──────────────────────────────────── */}
      {/* mobile: infinite carousel */}
      <div className="lg:hidden">
        <StatsCarousel stats={stats} />
      </div>
      {/* desktop: grid */}
      <div className="hidden grid-cols-3 gap-4 lg:grid">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
            <div className="mt-3 h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
          </div>
        ))}
      </div>

      {/* ── orders table card ──────────────────────────── */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* filter pills */}
        <div className="grid grid-cols-2 gap-2 border-b border-gray-100 p-4 sm:flex sm:flex-wrap sm:gap-2">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all' ? total : (orders?.filter((o) => o.status === tab.key).length ?? 0)
            const isActive = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key)
                  setPage(1)
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#4A6CF7] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-gray-300" />
          </div>
        ) : !filtered?.length ? (
          <div className="py-16 text-center text-sm text-gray-400">Nenhum pedido encontrado.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {paginated!.map((order) => {
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="group w-full px-6 py-4 text-left transition-colors hover:bg-gray-50/60"
                  >
                    {/* ── mobile layout ────────────────────────── */}
                    <div className="space-y-2 lg:hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4A6CF7]/10">
                            <ShoppingBag className="h-3.5 w-3.5 text-[#4A6CF7]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{order.id}</p>
                            <p className="text-[11px] text-gray-400">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <StatusBadge status={order.status} />
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <span
                            key={item.productId}
                            className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500"
                          >
                            {item.productName}{' '}
                            <span className="text-gray-400">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0 text-gray-300" />
                        <p className="text-[11px] text-gray-400">
                          {order.shippingAddress.city} — {order.shippingAddress.state}
                        </p>
                      </div>
                    </div>

                    {/* ── desktop layout ───────────────────────── */}
                    <div className="hidden lg:block">
                      {/* row header */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4A6CF7]/10">
                            <ShoppingBag className="h-4 w-4 text-[#4A6CF7]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{order.id}</p>
                            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <StatusBadge status={order.status} />
                          <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                      {/* items */}
                      <div className="mt-3 space-y-1 pl-12">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-500">
                              {item.productName}
                              <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-gray-400">
                                ×{item.quantity}
                              </span>
                            </span>
                            <span className="font-medium text-gray-700">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* address */}
                      <div className="mt-2.5 flex items-center gap-1.5 pl-12">
                        <MapPin className="h-3 w-3 shrink-0 text-gray-300" />
                        <p className="text-xs text-gray-400">
                          {order.shippingAddress.street}, {order.shippingAddress.city} —{' '}
                          {order.shippingAddress.state}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p className="text-xs text-gray-400">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered?.length ?? 0)}{' '}
                  de {filtered?.length ?? 0} pedidos
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                        p === page ? 'bg-[#4A6CF7] text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* detail drawer */}
      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
