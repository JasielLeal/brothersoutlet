import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService } from '@/features/products/services/products.service'
import type { ProductFilters } from '@/features/products/types/product.types'
import type { ProductInput } from '@/features/products/schemas/product.schema'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsService.getProducts(filters),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: Boolean(id),
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: [...productKeys.all, 'slug', slug],
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: productsService.getFeaturedProducts,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productsService.getCategories,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProductInput) => {
      const { categoryId, ...rest } = data
      return productsService.createProduct({
        ...rest,
        category: { id: categoryId, name: '', slug: '' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) => {
      const { categoryId, ...rest } = data
      return productsService.updateProduct(id, {
        ...rest,
        ...(categoryId ? { category: { id: categoryId, name: '', slug: '' } } : {}),
      })
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
