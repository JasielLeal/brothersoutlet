'use client'

import { useState, useRef, useEffect } from 'react'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { useProducts } from '@/features/products/hooks/useProducts'
import { formatCurrency } from '@/utils/formatCurrency'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { mockProducts } from '@/mock/products'

/* ── static seed data ──────────────────────────────────── */
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

const MONTHLY_REV = [
  42000, 55000, 38000, 61000, 74000, 58000, 82000, 69000, 77000, 91000, 85000, 78520,
]
const MONTHLY_PREV = [
  38000, 48000, 42000, 55000, 68000, 52000, 74000, 63000, 71000, 85000, 79000, 72000,
]

const WEEKDAY_CUR = [32, 58, 74, 91, 83, 65, 41]
const WEEKDAY_PREV = [28, 50, 68, 85, 77, 59, 36]
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const FUNNEL = [
  { label: 'Visitantes', value: 12480, pct: 100, color: '#D0DAFE' },
  { label: 'Visualizaram', value: 6240, pct: 50, color: '#8AA4F9' },
  { label: 'Carrinho', value: 2496, pct: 20, color: '#4A6CF7' },
  { label: 'Compraram', value: 998, pct: 8, color: '#2E4FD4' },
]

const TOP_PRODUCTS_REV = mockProducts.slice(0, 5).map((p, i) => ({
  ...p,
  sales: [184, 142, 119, 97, 76][i],
  revenue: p.price * [184, 142, 119, 97, 76][i],
}))

const CHANNELS = [
  { label: 'Orgânico', pct: 42, color: '#4A6CF7' },
  { label: 'Direto', pct: 28, color: '#8AA4F9' },
  { label: 'Social', pct: 18, color: '#D0DAFE' },
  { label: 'E-mail', pct: 12, color: '#E8EDFF' },
]

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

/* ── charts ────────────────────────────────────────────── */
function MonthlyBarChart({ selectedMonth }: { selectedMonth: number | null }) {
  const maxVal = Math.max(...MONTHLY_REV, ...MONTHLY_PREV)
  const H = 120
  const barW = 8
  const gap = 3
  const groupW = barW * 2 + gap + 16
  const totalW = 12 * groupW

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 20}`} className="w-full" preserveAspectRatio="none">
      {MONTHLY_REV.map((v, i) => {
        const x = i * groupW + 2
        const curH = (v / maxVal) * H
        const prevH = (MONTHLY_PREV[i] / maxVal) * H
        const isSelected = selectedMonth === i
        return (
          <g key={i}>
            <rect x={x} y={H - prevH} width={barW} height={prevH} rx="3" fill="#E2E8F0" />
            <rect
              x={x + barW + gap}
              y={H - curH}
              width={barW}
              height={curH}
              rx="3"
              fill={isSelected ? '#2E4FD4' : '#4A6CF7'}
            />
            <text
              x={x + barW + gap / 2}
              y={H + 14}
              textAnchor="middle"
              fontSize="7.5"
              fill="#94A3B8"
            >
              {MONTH_NAMES[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function WeekdayBarChart() {
  const maxVal = Math.max(...WEEKDAY_CUR, ...WEEKDAY_PREV)
  const H = 90
  const barW = 10
  const gap = 3
  const groupW = barW * 2 + gap + 14
  const totalW = 7 * groupW

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 18}`} className="w-full" preserveAspectRatio="none">
      {WEEKDAY_CUR.map((v, i) => {
        const x = i * groupW + 2
        const curH = (v / maxVal) * H
        const prevH = (WEEKDAY_PREV[i] / maxVal) * H
        return (
          <g key={i}>
            <rect x={x} y={H - prevH} width={barW} height={prevH} rx="3" fill="#E2E8F0" />
            <rect
              x={x + barW + gap}
              y={H - curH}
              width={barW}
              height={curH}
              rx="3"
              fill="#4A6CF7"
            />
            <text x={x + barW + gap / 2} y={H + 13} textAnchor="middle" fontSize="8" fill="#94A3B8">
              {WEEKDAYS[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ChannelDonut() {
  const cx = 55
  const cy = 55
  const r = 38
  const GAP = 5

  const arcs = CHANNELS.reduce<Array<(typeof CHANNELS)[0] & { startDeg: number; endDeg: number }>>(
    (acc, seg) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].endDeg + GAP / 2 : 0
      const deg = (seg.pct / 100) * 360
      return [...acc, { ...seg, startDeg: prev, endDeg: prev + deg - GAP }]
    },
    []
  )

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF0FF" strokeWidth="18" />
      {arcs.map((seg, i) => (
        <path
          key={i}
          d={describeArc(cx, cy, r, seg.startDeg, seg.endDeg)}
          fill="none"
          stroke={seg.color}
          strokeWidth="18"
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy} r={24} fill="white" />
    </svg>
  )
}

/* ── shared components ─────────────────────────────────── */
function ExportButton() {
  return (
    <button className="rounded-lg border border-[#4A6CF7] px-3 py-1 text-xs font-medium text-[#4A6CF7] transition-colors hover:bg-[#4A6CF7]/5">
      Exportar
    </button>
  )
}

function Trend({ up, value, label }: { up: boolean; value: string; label: string }) {
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <span
        className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
          up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
        }`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {value}
      </span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

/* ── KPI carousel (mobile + tablet infinite) ─────────────────── */
type KpiItem = {
  label: string
  value: string
  trend: string
  up: boolean
  sub: string
  accent: string
}

function KpiCarousel({ kpis }: { kpis: KpiItem[] }) {
  const n = kpis.length
  // Extended list for infinite: [clone-last, ...real, clone-first]
  const extended = [kpis[n - 1], ...kpis, kpis[0]]
  const [idx, setIdx] = useState(1) // start at first real card
  const [animated, setAnimated] = useState(true)
  const touchX = useRef(0)

  // After reaching a clone, silently teleport to the real counterpart
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

  // Normalise current dot (0-based)
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
        {extended.map((k, i) => (
          <div key={i} className="w-full shrink-0 px-0.5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{k.value}</p>
              <Trend up={k.up} value={k.trend} label={k.sub} />
              <div className="mt-3 h-1 w-10 rounded-full" style={{ backgroundColor: k.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {kpis.map((_, i) => (
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

/* ── generic slide carousel (mobile + tablet) ─────────────────── */
function SlideCarousel({ children }: { children: React.ReactNode[] }) {
  const n = children.length
  const extended = [children[n - 1], ...children, children[0]]
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
        {extended.map((child, i) => (
          <div key={i} className="w-full shrink-0">
            {child}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {Array.from({ length: n }, (_, i) => (
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
export default function AnalyticsPage() {
  const { data: orders } = useOrders()
  const { data: productsData } = useProducts({ limit: 100 })
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const totalRevenue = orders?.reduce((s, o) => s + o.total, 0) ?? 78520
  const totalOrders = orders?.length ?? 247
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 318
  const cancelRate = orders
    ? (orders.filter((o) => o.status === 'cancelled').length / Math.max(orders.length, 1)) * 100
    : 4.2

  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`

  const kpis = [
    {
      label: 'Receita Total',
      value: formatCurrency(totalRevenue),
      trend: '+12,4%',
      up: true,
      sub: 'vs mês passado',
      accent: '#4A6CF7',
    },
    {
      label: 'Pedidos',
      value: totalOrders.toLocaleString('pt-BR'),
      trend: '+8,1%',
      up: true,
      sub: 'vs mês passado',
      accent: '#22C55E',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(avgTicket),
      trend: '+3,6%',
      up: true,
      sub: 'vs mês passado',
      accent: '#F5A623',
    },
    {
      label: 'Taxa Cancelamento',
      value: `${cancelRate.toFixed(1)}%`,
      trend: '-1,2pp',
      up: true,
      sub: 'vs mês passado',
      accent: '#EF4444',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <MobileMenuButton />
        <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
      </div>

      {/* ── KPIs ─────────────────────────────────────── */}
      {/* mobile + tablet: infinite carousel */}
      <div className="lg:hidden">
        <KpiCarousel kpis={kpis} />
      </div>
      {/* desktop: grid */}
      <div className="hidden grid-cols-2 gap-5 lg:grid xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{k.value}</p>
            <Trend up={k.up} value={k.trend} label={k.sub} />
            <div className="mt-3 h-1 w-10 rounded-full" style={{ backgroundColor: k.accent }} />
          </div>
        ))}
      </div>

      {/* ── receita anual + funil ────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Receita por mês */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 xl:col-span-3">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Receita Mensal</h2>
            <ExportButton />
          </div>
          <p className="mb-4 text-xs text-gray-400">Janeiro – {monthLabel}</p>
          <MonthlyBarChart selectedMonth={selectedMonth} />
          <div className="mt-4 flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
              {now.getFullYear()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              {now.getFullYear() - 1}
            </span>
          </div>
          {/* month chips */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {MONTH_NAMES.map((m, i) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedMonth === i
                    ? 'bg-[#4A6CF7] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {m}
                {selectedMonth === i && (
                  <span className="ml-1 font-semibold">{formatCurrency(MONTHLY_REV[i])}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Funil de conversão */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
          <h2 className="mb-0.5 text-sm font-semibold text-gray-600">Funil de Conversão</h2>
          <p className="mb-6 text-xs text-gray-400">Jornada do cliente este mês</p>
          <div className="space-y-3">
            {FUNNEL.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700">{f.label}</span>
                  <span className="text-gray-400">{f.value.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[10px] text-gray-400">{f.pct}%</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-[#4A6CF7]/5 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">Taxa de conversão final</p>
            <p className="mt-0.5 text-xl font-bold text-[#4A6CF7]">8,0%</p>
          </div>
        </div>
      </div>

      {/* ── pedidos por dia + top produtos + canais ──── */}
      {/* mobile + tablet: carousel */}
      <div className="lg:hidden">
        <SlideCarousel>
          {[
            /* Pedidos por dia */
            <div key="pedidos" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="mt-0.5 mb-4 text-xs text-gray-400">Média por dia da semana</p>
              <WeekdayBarChart />
              <div className="mt-3 flex items-center gap-5">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
                  Esta semana
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                  Semana passada
                </span>
              </div>
            </div>,
            /* Top produtos */
            <div key="produtos" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="mt-0.5 mb-5 text-xs text-gray-400">Por receita gerada</p>
              <div className="space-y-3">
                {TOP_PRODUCTS_REV.map((p, i) => {
                  const maxRev = TOP_PRODUCTS_REV[0].revenue
                  return (
                    <div key={p.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="w-4 text-[10px] font-bold text-gray-300">#{i + 1}</span>
                          <span className="max-w-32.5 truncate font-medium text-gray-700">
                            {p.name}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold text-gray-700">
                          {formatCurrency(p.revenue)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[#4A6CF7]"
                          style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>,
            /* Canais de aquisição */
            <div key="canais" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <p className="mt-0.5 mb-5 text-xs text-gray-400">Origem do tráfego este mês</p>
              <div className="flex items-center gap-4">
                <ChannelDonut />
                <div className="flex-1 space-y-2.5">
                  {CHANNELS.map((c) => (
                    <div key={c.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-gray-600">{c.label}</span>
                      </div>
                      <span className="font-semibold text-gray-700">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
                  <p className="text-[10px] text-gray-400">Novos</p>
                  <p className="text-sm font-bold text-gray-800">68%</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
                  <p className="text-[10px] text-gray-400">Recorrentes</p>
                  <p className="text-sm font-bold text-gray-800">32%</p>
                </div>
              </div>
            </div>,
          ]}
        </SlideCarousel>
      </div>
      {/* desktop: grid */}
      <div className="hidden grid-cols-1 gap-5 md:grid-cols-3 lg:grid">
        {/* Pedidos por dia da semana */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Pedidos por Dia</h2>
          <p className="mt-0.5 mb-4 text-xs text-gray-400">Média por dia da semana</p>
          <WeekdayBarChart />
          <div className="mt-3 flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4A6CF7]" />
              Esta semana
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              Semana passada
            </span>
          </div>
        </div>

        {/* Top produtos por receita */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Top Produtos</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Por receita gerada</p>
          <div className="space-y-3">
            {TOP_PRODUCTS_REV.map((p, i) => {
              const maxRev = TOP_PRODUCTS_REV[0].revenue
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-4 text-[10px] font-bold text-gray-300">#{i + 1}</span>
                      <span className="max-w-32.5 truncate font-medium text-gray-700">
                        {p.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-gray-700">
                      {formatCurrency(p.revenue)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-[#4A6CF7]"
                      style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Canais de aquisição */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-sm font-semibold text-gray-600">Canais de Aquisição</h2>
          <p className="mt-0.5 mb-5 text-xs text-gray-400">Origem do tráfego este mês</p>
          <div className="flex items-center gap-4">
            <ChannelDonut />
            <div className="flex-1 space-y-2.5">
              {CHANNELS.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-gray-600">{c.label}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
              <p className="text-[10px] text-gray-400">Novos</p>
              <p className="text-sm font-bold text-gray-800">68%</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2.5 text-center">
              <p className="text-[10px] text-gray-400">Recorrentes</p>
              <p className="text-sm font-bold text-gray-800">32%</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {productsData?.total ?? 0} produtos cadastrados · Dados atualizados em{' '}
        {now.toLocaleDateString('pt-BR')}
      </p>
    </div>
  )
}
