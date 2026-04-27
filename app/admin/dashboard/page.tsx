'use client'

import { useRef, useEffect, useState as useSlideState } from 'react'
import Image from 'next/image'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { formatCurrency } from '@/utils/formatCurrency'
import { mockProducts } from '@/mock/products'
import { TrendingUp, TrendingDown } from 'lucide-react'

/* ── static chart data ─────────────────────────────────── */
// Gera dados por dia do mês atual (até hoje)
function buildBarData() {
  const now = new Date()
  const today = now.getDate()
  const seed = [
    45, 62, 38, 75, 90, 55, 82, 48, 70, 95, 60, 85, 52, 68, 44, 78, 91, 36, 73, 88, 41, 66, 57, 83,
    47, 72, 94, 39, 64, 79, 53,
  ]
  const seedP = [
    35, 45, 52, 40, 60, 38, 70, 55, 42, 65, 48, 72, 43, 58, 50, 62, 74, 44, 59, 71, 37, 53, 61, 68,
    55, 63, 77, 46, 57, 69, 48,
  ]
  return Array.from({ length: today }, (_, i) => ({
    day: String(i + 1).padStart(2, '0'),
    cur: seed[i % seed.length],
    prev: seedP[i % seedP.length],
  }))
}

const MONTH_NAMES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const DONUT_DATA = [
  { label: 'Tarde', sublabel: '13h–16h', pct: 40, orders: 1890, color: '#4A6CF7' },
  { label: 'Noite', sublabel: '18h–21h', pct: 32, orders: 1512, color: '#8AA4F9' },
  { label: 'Manhã', sublabel: '9h–12h', pct: 28, orders: 1323, color: '#D0DAFE' },
]

const LINE_CUR = [30, 45, 28, 60, 42, 75]
const LINE_PREV = [50, 38, 55, 35, 65, 48]

const TOP_PRODUCTS = mockProducts.slice(0, 4)

/* ── SVG helpers ───────────────────────────────────────── */
function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCart(cx, cy, r, start)
  const e = polarToCart(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

/* ── sub-components ────────────────────────────────────── */
function BarChart() {
  const barData = buildBarData()
  const maxVal = Math.max(...barData.flatMap((d) => [d.cur, d.prev]))
  const H = 130
  const barW = 6
  const gap = 2
  const groupW = barW * 2 + gap + 10
  const totalW = barData.length * groupW

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 18}`} className="w-full" preserveAspectRatio="none">
      {barData.map((d, i) => {
        const x = i * groupW + 2
        const curH = (d.cur / maxVal) * H
        const prevH = (d.prev / maxVal) * H
        return (
          <g key={i}>
            <rect x={x} y={H - curH} width={barW} height={curH} rx="3" fill="#4A6CF7" />
            <rect
              x={x + barW + gap}
              y={H - prevH}
              width={barW}
              height={prevH}
              rx="3"
              fill="#E2E8F0"
            />
            {/* só mostra label a cada 5 dias para não poluir */}
            {(i === 0 || (i + 1) % 5 === 0 || i === barData.length - 1) && (
              <text
                x={x + barW + gap / 2}
                y={H + 14}
                textAnchor="middle"
                fontSize="8"
                fill="#94A3B8"
              >
                {d.day}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function DonutChart() {
  const cx = 65
  const cy = 65
  const r = 46
  const GAP = 4

  const arcs = DONUT_DATA.reduce<
    Array<(typeof DONUT_DATA)[0] & { startDeg: number; endDeg: number }>
  >((acc, seg) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].endDeg + GAP / 2 : 0
    const deg = (seg.pct / 100) * 360
    return [...acc, { ...seg, startDeg: prev, endDeg: prev + deg - GAP }]
  }, [])

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF0FF" strokeWidth="22" />
      {arcs.map((seg, i) => (
        <path
          key={i}
          d={describeArc(cx, cy, r, seg.startDeg, seg.endDeg)}
          fill="none"
          stroke={seg.color}
          strokeWidth="22"
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy} r={30} fill="white" />
    </svg>
  )
}

function LineChart() {
  const W = 280
  const H = 80
  const maxVal = Math.max(...LINE_CUR, ...LINE_PREV)

  const toPoints = (arr: number[]) =>
    arr
      .map((v, i) => {
        const x = (i / (arr.length - 1)) * W
        const y = H - (v / maxVal) * (H - 8)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')

  const areaPoints = LINE_CUR.map((v, i) => {
    const x = (i / (LINE_CUR.length - 1)) * W
    const y = H - (v / maxVal) * (H - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <polygon points={`0,${H} ${areaPoints} ${W},${H}`} fill="#4A6CF7" fillOpacity="0.07" />
      <polyline
        points={toPoints(LINE_PREV)}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points={toPoints(LINE_CUR)}
        fill="none"
        stroke="#4A6CF7"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── SlideCarousel ─────────────────────────────── */
function SlideCarousel({ children }: { children: React.ReactNode[] }) {
  const items = [children[children.length - 1], ...children, children[0]]
  const [idx, setIdx] = useSlideState(1)
  const [transitioning, setTransitioning] = useSlideState(true)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    if (!transitioning) return
    if (idx === 0) {
      const t = setTimeout(() => {
        setTransitioning(false)
        setIdx(children.length)
      }, 300)
      return () => clearTimeout(t)
    }
    if (idx === items.length - 1) {
      const t = setTimeout(() => {
        setTransitioning(false)
        setIdx(1)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [idx, transitioning, items.length, children.length, setIdx, setTransitioning])

  useEffect(() => {
    if (!transitioning) {
      const t = requestAnimationFrame(() => setTransitioning(true))
      return () => cancelAnimationFrame(t)
    }
  }, [transitioning, setTransitioning])

  function go(dir: 1 | -1) {
    setTransitioning(true)
    setIdx((i) => i + dir)
  }
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    const dx = startX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) go(dx > 0 ? 1 : -1)
    startX.current = null
  }

  const realIdx = idx === 0 ? children.length - 1 : idx === items.length - 1 ? 0 : idx - 1

  return (
    <div className="lg:hidden">
      <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex"
          style={{
            transform: `translateX(-${idx * 100}%)`,
            transition: transitioning ? 'transform 300ms ease' : 'none',
          }}
        >
          {items.map((child, i) => (
            <div key={i} className="w-full shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setTransitioning(true)
              setIdx(i + 1)
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === realIdx ? 'w-4 bg-[#4A6CF7]' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ReportButton() {
  return (
    <button className="rounded-lg border border-[#4A6CF7] px-3 py-1 text-xs font-medium text-[#4A6CF7] transition-colors hover:bg-[#4A6CF7]/5">
      Ver Relatório
    </button>
  )
}

/* ── page ──────────────────────────────────────────────── */
export default function DashboardPage() {
  const { data: productsData } = useProducts({ limit: 100 })
  const { data: orders } = useOrders()

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0
  const totalOrders = orders?.length ?? 0

  // Use real data if loaded, otherwise show illustrative fallback
  const displayRevenue = orders ? totalRevenue : 78520
  const displayOrders = orders ? totalOrders : 2568

  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`
  const rangeLabel = `1–${now.getDate()} ${MONTH_NAMES[now.getMonth()]}, ${now.getFullYear()}`

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <MobileMenuButton />
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* ── top row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Receita */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Receita</h2>
            <ReportButton />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(displayRevenue)}</p>
          <div className="mt-1.5 mb-3 flex items-center gap-2">
            <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
              <TrendingUp className="h-3 w-3" />
              2,1%
            </span>
            <span className="text-xs text-gray-400">vs mês passado</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">Vendas de {rangeLabel}</p>
          <BarChart />
          <div className="mt-3 flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
              {monthLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              Mês passado
            </span>
          </div>
        </div>

        {/* Horário dos Pedidos */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Horário dos Pedidos</h2>
            <ReportButton />
          </div>
          <p className="mb-6 text-xs text-gray-400">De 1–6 Dez, 2024</p>

          <div className="relative flex justify-center">
            <DonutChart />
            {/* tooltip */}
            <div className="pointer-events-none absolute -top-2 left-[54%] rounded-xl bg-gray-800 px-3 py-2 text-white shadow-xl">
              <p className="text-[10px] font-semibold opacity-80">Tarde</p>
              <p className="text-[10px] opacity-60">13h – 16h</p>
              <p className="text-sm font-bold">1.890 pedidos</p>
              <div className="absolute top-3.5 -left-1.5 h-3 w-3 rotate-45 bg-gray-800" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1 text-center">
            {DONUT_DATA.map((seg) => (
              <div key={seg.label}>
                <div className="mb-0.5 flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-[11px] font-medium text-gray-700">{seg.label}</span>
                </div>
                <p className="text-xs font-bold text-gray-900">{seg.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── bottom row ───────────────────────────────── */}
      <SlideCarousel>
        {/* Categorias de Destaque */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Categorias de Destaque</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Top 3 categorias do mês</p>

          <div className="relative mx-auto h-52 w-52">
            {/* Camisetas — top left */}
            <div className="absolute top-0 left-0 flex h-30 w-30 items-center justify-center rounded-full bg-[#4A6CF7]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '1').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Camisetas</p>
              </div>
            </div>
            {/* Calças — top right */}
            <div className="absolute top-5 right-0 flex h-30 w-30 items-center justify-center rounded-full bg-[#F5A623]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '2').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Calças</p>
              </div>
            </div>
            {/* Calçados — bottom center */}
            <div className="absolute bottom-0 left-10 flex h-30 w-30 items-center justify-center rounded-full bg-[#4BC9C8]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '3').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Calçados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mais Vendidos */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Mais Vendidos</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Produtos com maior demanda</p>

          <div className="space-y-4">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                  {p.name}
                </p>
                <span className="shrink-0 text-sm font-semibold text-gray-700">
                  {formatCurrency(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Pedidos</h2>
            <ReportButton />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {displayOrders.toLocaleString('pt-BR')}
          </p>
          <div className="mt-1.5 mb-3 flex items-center gap-2">
            <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
              <TrendingDown className="h-3 w-3" />
              2,1%
            </span>
            <span className="text-xs text-gray-400">vs semana passada</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">Vendas de 1–6 Dez, 2024</p>
          <LineChart />
          <div className="mt-3 flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
              Últimos 6 dias
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              Semana passada
            </span>
          </div>
        </div>
      </SlideCarousel>

      <div className="hidden grid-cols-3 gap-5 lg:grid">
        {/* Categorias de Destaque */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Categorias de Destaque</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Top 3 categorias do mês</p>

          <div className="relative mx-auto h-52 w-52">
            {/* Camisetas — top left */}
            <div className="absolute top-0 left-0 flex h-30 w-30 items-center justify-center rounded-full bg-[#4A6CF7]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '1').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Camisetas</p>
              </div>
            </div>
            {/* Calças — top right */}
            <div className="absolute top-5 right-0 flex h-30 w-30 items-center justify-center rounded-full bg-[#F5A623]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '2').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Calças</p>
              </div>
            </div>
            {/* Calçados — bottom center */}
            <div className="absolute bottom-0 left-10 flex h-30 w-30 items-center justify-center rounded-full bg-[#4BC9C8]">
              <div className="text-center text-white">
                <p className="text-lg leading-none font-bold">
                  {mockProducts.filter((p) => p.category.id === '3').length}
                </p>
                <p className="mt-1 text-[11px] font-medium">Calçados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mais Vendidos */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Mais Vendidos</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Produtos com maior demanda</p>

          <div className="space-y-4">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                  {p.name}
                </p>
                <span className="shrink-0 text-sm font-semibold text-gray-700">
                  {formatCurrency(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Pedidos</h2>
            <ReportButton />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {displayOrders.toLocaleString('pt-BR')}
          </p>
          <div className="mt-1.5 mb-3 flex items-center gap-2">
            <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
              <TrendingDown className="h-3 w-3" />
              2,1%
            </span>
            <span className="text-xs text-gray-400">vs semana passada</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">Vendas de 1–6 Dez, 2024</p>
          <LineChart />
          <div className="mt-3 flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
              Últimos 6 dias
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              Semana passada
            </span>
          </div>
        </div>
      </div>

      {/* ── products info ─────────────────────────────── */}
      <p className="text-xs text-gray-400">
        {productsData?.total ?? 0} produtos cadastrados no total
      </p>
    </div>
  )
}
