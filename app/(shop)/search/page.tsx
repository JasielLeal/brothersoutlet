'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { useProducts, useCategories } from '@/features/products/hooks/useProducts'
import { ProductCard } from '@/features/products/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/utils/formatCurrency'

/* ─── constants ─────────────────────────────────────────── */

const PRICE_MIN = 0
const PRICE_MAX = 25000
const PRICE_STEP = 100

const HISTOGRAM_BARS = [2, 4, 7, 12, 18, 26, 32, 24, 15, 9, 6, 4, 2]

/* ─── dual range slider ─────────────────────────────────── */

function DualRangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  min: number
  max: number
  minVal: number
  maxVal: number
  onMinChange: (v: number) => void
  onMaxChange: (v: number) => void
}) {
  const minPercent = ((minVal - min) / (max - min)) * 100
  const maxPercent = ((maxVal - min) / (max - min)) * 100

  return (
    <div className="relative h-5 w-full">
      {/* Track background */}
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />
      {/* Active track */}
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#1565a0]"
        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
      />
      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={PRICE_STEP}
        value={minVal}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (v < maxVal) onMinChange(v)
        }}
        className="price-range-thumb"
        style={{ zIndex: minVal > max - PRICE_STEP ? 5 : 3 }}
      />
      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={PRICE_STEP}
        value={maxVal}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (v > minVal) onMaxChange(v)
        }}
        className="price-range-thumb"
        style={{ zIndex: 4 }}
      />
    </div>
  )
}

/* ─── price histogram (decorative) ─────────────────────── */

function PriceHistogram({ minVal, maxVal }: { minVal: number; maxVal: number }) {
  const maxH = Math.max(...HISTOGRAM_BARS)
  return (
    <svg viewBox="0 0 104 40" className="w-full" aria-hidden>
      {HISTOGRAM_BARS.map((h, i) => {
        const barPrice = PRICE_MIN + ((i + 0.5) / HISTOGRAM_BARS.length) * (PRICE_MAX - PRICE_MIN)
        const inRange = barPrice >= minVal && barPrice <= maxVal
        const barH = (h / maxH) * 36
        return (
          <rect
            key={i}
            x={i * 8}
            y={40 - barH}
            width={7}
            height={barH}
            rx="2"
            fill={inRange ? '#1565a0' : '#e5e7eb'}
          />
        )
      })}
    </svg>
  )
}

/* ─── checkbox ──────────────────────────────────────────── */

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
        checked ? 'border-primary bg-primary' : 'hover:border-primary border-gray-300 bg-white'
      }`}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}

/* ─── main content (needs Suspense for useSearchParams) ─── */

function SearchContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [priceMin, setPriceMin] = useState(PRICE_MIN)
  const [priceMax, setPriceMax] = useState(PRICE_MAX)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const { data: categoriesData } = useCategories()

  const { data, isLoading } = useProducts({
    search: q || undefined,
    minPrice: priceMin > PRICE_MIN ? priceMin : undefined,
    maxPrice: priceMax < PRICE_MAX ? priceMax : undefined,
    limit: 100,
  })

  const allProducts = data?.data ?? []

  const products = allProducts.filter((p) => {
    if (minRating !== null && p.rating < minRating) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category.id)) return false
    return true
  })

  const categories = categoriesData ?? []
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5)

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const avgPrice = Math.round((priceMin + priceMax) / 2)

  const activeFilterCount =
    (priceMin > PRICE_MIN || priceMax < PRICE_MAX ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    selectedCategories.length

  /* ── conteúdo dos filtros (compartilhado entre sidebar e drawer) ── */
  const filtersContent = (
    <>
      {/* Price Range */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Faixa de Preço</h3>
          <button
            onClick={() => {
              setPriceMin(PRICE_MIN)
              setPriceMax(PRICE_MAX)
            }}
            className="text-primary text-xs hover:underline"
          >
            Resetar
          </button>
        </div>
        <p className="mb-3 text-xs text-gray-400">Preço médio é {formatCurrency(avgPrice)}</p>

        <PriceHistogram minVal={priceMin} maxVal={priceMax} />

        <div className="mt-2 mb-3">
          <DualRangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            minVal={priceMin}
            maxVal={priceMax}
            onMinChange={setPriceMin}
            onMaxChange={setPriceMax}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
            {formatCurrency(priceMin)}
          </span>
          <span className="h-px flex-1 bg-gray-200" />
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
            {formatCurrency(priceMax)}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Categoria</h3>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-primary text-xs hover:underline"
            >
              Resetar
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {visibleCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-3"
              onClick={() => toggleCategory(cat.id)}
            >
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
        {categories.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllCategories((v) => !v)}
            className="text-primary mt-3 flex items-center gap-1 text-xs font-medium hover:underline"
          >
            {showAllCategories ? 'Ver menos' : 'Mais categorias'}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showAllCategories ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
    </>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {q ? `Resultados para "${q}"` : 'Todos os produtos'}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {isLoading
              ? 'Buscando…'
              : `${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Botão filtros — só no mobile */}
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="relative flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-[#1565a0]/40 hover:text-[#1565a0] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1565a0] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar — desktop ──────────────────────────── */}
        <aside className="hidden w-56 shrink-0 lg:block">{filtersContent}</aside>

        {/* ── Product Grid ──────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-semibold text-gray-700">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-gray-400">
                Tente alterar os filtros ou busque por outro termo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Drawer mobile ─────────────────────────────────── */}
      {filterOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl bg-gray-50 lg:hidden">
            {/* Handle */}
            <div className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Filtros</h2>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[#1565a0] px-2 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPriceMin(PRICE_MIN)
                      setPriceMax(PRICE_MAX)
                      setMinRating(null)
                      setSelectedCategories([])
                    }}
                    className="text-sm text-[#1565a0] hover:underline"
                  >
                    Limpar tudo
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo rolável */}
            <div className="overflow-y-auto px-4 pb-6">{filtersContent}</div>

            {/* Botão aplicar */}
            <div className="shrink-0 border-t bg-white px-4 py-4">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-xl bg-[#1565a0] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Ver {products.length} resultado{products.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── page export ───────────────────────────────────────── */

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
