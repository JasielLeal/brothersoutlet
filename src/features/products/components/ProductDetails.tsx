'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Star, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/features/cart/hooks/useCart'
import type { Product } from '@/features/products/types/product.types'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  function handleAddToCart() {
    addItem(product, quantity)
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {discount && (
            <Badge className="absolute top-3 left-3" variant="destructive">
              -{discount}%
            </Badge>
          )}
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((i) => Math.min(product.images.length - 1, i + 1))
                }
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white"
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
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                  i === selectedImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {product.category.name}
          </Badge>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {product.rating} ({product.reviewsCount} avaliações)
          </span>
        </div>

        <Separator />

        <div className="space-y-1">
          {product.originalPrice && (
            <p className="text-muted-foreground text-sm line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
          <p className="text-primary text-3xl font-bold">{formatCurrency(product.price)}</p>
          {discount && (
            <p className="text-sm font-medium text-green-600">Você economiza {discount}%</p>
          )}
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Package className="text-muted-foreground h-4 w-4" />
          <span
            className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}
          >
            {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border">
            <button
              className="hover:bg-muted px-3 py-2 text-lg"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <button
              className="hover:bg-muted px-3 py-2 text-lg"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              +
            </button>
          </div>

          <Button className="flex-1" disabled={product.stock === 0} onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
          </Button>
        </div>
      </div>
    </div>
  )
}
