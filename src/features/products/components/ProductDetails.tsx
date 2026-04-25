'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import type { Product } from '@/features/products/types/product.types'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

/* ── accordion ── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const { addItem } = useCart()
  const router = useRouter()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ── Galeria ───────────────────────────────────── */}
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {discount && (
            <span className="absolute top-3 left-3 rounded-full bg-[#1565a0] px-2.5 py-0.5 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((i) => Math.min(product.images.length - 1, i + 1))
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                  i === selectedImageIndex
                    ? 'border-gray-900'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info ──────────────────────────────────────── */}
      <div className="flex flex-col">
        {/* Categoria */}
        <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {product.category.name}
        </p>

        {/* Nome */}
        <h1 className="mb-4 text-2xl leading-tight font-bold text-gray-900">{product.name}</h1>

        {/* Preço */}
        <div className="mb-4">
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
          <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(product.price)}</p>
        </div>

        {/* Tamanho */}
        <div className="mb-6">
          <p className="mb-2.5 text-sm font-semibold text-gray-900">
            Tamanho: <span className="font-normal text-gray-500">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`h-10 min-w-11 rounded-full px-4 text-sm font-semibold transition-all ${
                  selectedSize === size
                    ? 'bg-[#1565a0] text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-[#1565a0]/40'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="mb-6 flex gap-3">
          <button
            disabled={product.stock === 0}
            onClick={() => {
              addItem(product)
              router.push('/cart')
            }}
            className="flex-1 rounded-2xl bg-[#1565a0] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
          </button>
          <button
            type="button"
            onClick={() => toggleItem(product)}
            className="flex h-12.5 w-12.5 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-colors hover:border-gray-300"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Acordeão: Descrição */}
        <Accordion title="Descrição &amp; Composição">
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
        </Accordion>
      </div>
    </div>
  )
}
