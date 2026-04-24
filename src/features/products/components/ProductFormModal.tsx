'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { productSchema, type ProductInput } from '@/features/products/schemas/product.schema'
import {
  useCreateProduct,
  useUpdateProduct,
  useCategories,
} from '@/features/products/hooks/useProducts'
import type { Product } from '@/features/products/types/product.types'

interface ProductFormModalProps {
  open: boolean
  product: Product | null
  onClose: () => void
}

export function ProductFormModal({ open, product, onClose }: ProductFormModalProps) {
  const { data: categories } = useCategories()
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProductInput>({ resolver: zodResolver(productSchema) as any })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        categoryId: product.category.id,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        images: product.images,
      })
    } else {
      reset({ isActive: true, isFeatured: false, images: [] })
    }
  }, [product, reset])

  function onSubmit(data: ProductInput) {
    if (product) {
      updateProduct({ id: product.id, data }, { onSuccess: onClose })
    } else {
      createProduct(data, { onSuccess: onClose })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-md p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              rows={3}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="originalPrice">Preço original</Label>
              <Input id="originalPrice" type="number" step="0.01" {...register('originalPrice')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                {...register('categoryId')}
              >
                <option value="">Selecione</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-destructive text-xs">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock">Estoque</Label>
              <Input id="stock" type="number" {...register('stock')} />
              {errors.stock && <p className="text-destructive text-xs">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">URL da imagem</Label>
            <Input id="image" placeholder="https://..." {...register('images.0')} />
            {errors.images && (
              <p className="text-destructive text-xs">{errors.images.message as string}</p>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded" />
              Ativo
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded" />
              Destaque
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Salvar alterações' : 'Criar produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
