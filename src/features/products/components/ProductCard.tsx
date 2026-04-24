'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/features/cart/hooks/useCart'
import type { Product } from '@/features/products/types/product.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      {/* Imagem — ocupa toda a seção */}
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-t-2xl bg-gray-50"
      >
        <div className="relative aspect-square">
          <Image
            src={product.images[selectedImage] ?? product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        {discount && (
          <span className="absolute top-3 left-3 rounded-full bg-[#1565a0] px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900">
              Indisponível
            </span>
          </div>
        )}
      </Link>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-2 px-3 pt-3 pb-2">
          {product.images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative h-10 w-10 overflow-hidden rounded-lg border-2 bg-gray-50 transition-all ${
                selectedImage === i
                  ? 'border-gray-900'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="40px" />
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          {product.category.name}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-3 line-clamp-2 text-sm leading-snug font-bold text-gray-900 hover:text-[#1565a0]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto mb-4 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
            className="flex-1 rounded-xl bg-gray-900 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
          </button>
          <button
            onClick={() => setWishlisted((w) => !w)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-[#1565a0] text-[#1565a0]' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
