'use client'

import { useState, useRef, useEffect } from 'react'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import Image from 'next/image'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useProducts, useDeleteProduct, useCategories } from '@/features/products/hooks/useProducts'
import { formatCurrency } from '@/utils/formatCurrency'
import { ProductFormModal } from '@/features/products/components/ProductFormModal'
import type { Product } from '@/features/products/types/product.types'

/* ── stats carousel (mobile + tablet infinite) ──────────────── */
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

export default function AdminProductsPage() {
  const PAGE_SIZE = 5

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  function handleSearch(v: string) {
    setSearch(v)
    setPage(1)
  }
  function handleCategory(v: string) {
    setCategoryId(v)
    setPage(1)
  }

  const { data: productsData, isLoading } = useProducts({
    limit: PAGE_SIZE,
    page,
    search: search || undefined,
    categoryId: categoryId || undefined,
  })
  const { data: categories } = useCategories()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const products = productsData?.data ?? []
  const total = productsData?.total ?? 0
  const totalPages = productsData?.totalPages ?? 1
  const active = products.filter((p) => p.isActive).length
  const inactive = products.filter((p) => !p.isActive).length
  const noStock = products.filter((p) => p.stock === 0).length

  const stats = [
    { label: 'Total', value: total, accent: '#4A6CF7' },
    { label: 'Ativos', value: active, accent: '#22C55E' },
    { label: 'Inativos', value: inactive, accent: '#94A3B8' },
    { label: 'Sem estoque', value: noStock, accent: '#EF4444' },
  ]

  return (
    <div className="space-y-5">
      {/* ── header ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenuButton />
          <h1 className="text-xl font-bold text-gray-800">Produtos</h1>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#4A6CF7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3a5ce5]"
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </button>
      </div>

      {/* ── stats row ────────────────────────────────── */}
      {/* mobile + tablet: infinite carousel */}
      <div className="lg:hidden">
        <StatsCarousel stats={stats} />
      </div>
      {/* desktop: grid */}
      <div className="hidden grid-cols-4 gap-4 lg:grid">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
            <div className="mt-3 h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
          </div>
        ))}
      </div>

      {/* ── filters ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full rounded-xl border-0 bg-white py-2.5 pr-4 pl-9 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4A6CF7]/30 focus:outline-none"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => handleCategory(e.target.value)}
          className="rounded-xl border-0 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-[#4A6CF7]/30 focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── table card ───────────────────────────────── */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-gray-300" />
          </div>
        ) : !products.length ? (
          <div className="py-16 text-center text-sm text-gray-400">Nenhum produto encontrado.</div>
        ) : (
          <>
            {/* ── mobile + tablet card list ────────────────────────── */}
            <div className="divide-y divide-gray-50 lg:hidden">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-800">{product.name}</p>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          product.isActive
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-xs text-gray-400">{product.category.name}</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {formatCurrency(product.price)}
                      </span>
                      <span
                        className={`text-xs font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock <= 10 ? 'text-amber-500' : 'text-green-600'}`}
                      >
                        Estoque: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#4A6CF7]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── desktop table ─────────────────────────────────── */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Produto
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Categoria
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Preço
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Estoque
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Avaliação
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-800">{product.name}</p>
                            {product.isFeatured && (
                              <span className="text-[10px] font-semibold text-amber-500">
                                Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">{product.category.name}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(product.price)}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-[11px] text-gray-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            product.stock === 0
                              ? 'text-red-500'
                              : product.stock <= 10
                                ? 'text-amber-500'
                                : 'text-green-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({product.reviewsCount})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.isActive
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {product.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#4A6CF7]"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            disabled={isDeleting}
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── pagination ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Exibindo{' '}
            <span className="font-semibold text-gray-700">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
            </span>{' '}
            de <span className="font-semibold text-gray-700">{total}</span> produtos
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:shadow-sm disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  p === page
                    ? 'bg-[#4A6CF7] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-white hover:shadow-sm'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:shadow-sm disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ProductFormModal
        open={isCreateOpen || editingProduct !== null}
        product={editingProduct}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingProduct(null)
        }}
      />
    </div>
  )
}
