'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useProducts, useDeleteProduct } from '@/features/products/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/formatCurrency'
import { ProductFormModal } from '@/features/products/components/ProductFormModal'
import type { Product } from '@/features/products/types/product.types'

export default function AdminProductsPage() {
  const { data: productsData, isLoading } = useProducts({ limit: 100 })
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            {productsData?.total ?? 0} produto(s) cadastrado(s)
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-card rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-muted-foreground p-4 text-left font-medium">Produto</th>
                  <th className="text-muted-foreground p-4 text-left font-medium">Categoria</th>
                  <th className="text-muted-foreground p-4 text-left font-medium">Preço</th>
                  <th className="text-muted-foreground p-4 text-left font-medium">Estoque</th>
                  <th className="text-muted-foreground p-4 text-left font-medium">Status</th>
                  <th className="text-muted-foreground p-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {productsData?.data.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground p-4">{product.category.name}</td>
                    <td className="p-4 font-medium">{formatCurrency(product.price)}</td>
                    <td className="p-4">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting}
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
