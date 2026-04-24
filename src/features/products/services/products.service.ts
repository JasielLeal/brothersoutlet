import { mockProducts, mockCategories } from '@/mock/products'
import type { Product, ProductFilters, Category } from '@/features/products/types/product.types'
import type { PaginatedResponse } from '@/types/global.types'

const FAKE_DELAY = 600

export const productsService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))

    let results = [...mockProducts]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
      )
    }

    if (filters.categoryId) {
      results = results.filter((p) => p.category.id === filters.categoryId)
    }

    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters.isFeatured !== undefined) {
      results = results.filter((p) => p.isFeatured === filters.isFeatured)
    }

    const page = filters.page ?? 1
    const limit = filters.limit ?? 12
    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const data = results.slice(start, start + limit)

    return { data, total, page, limit, totalPages }
  },

  async getProductById(id: string): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const product = mockProducts.find((p) => p.id === id)
    if (!product) throw new Error('Produto não encontrado')
    return product
  },

  async getProductBySlug(slug: string): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const product = mockProducts.find((p) => p.slug === slug)
    if (!product) throw new Error('Produto não encontrado')
    return product
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    return mockProducts.filter((p) => p.isFeatured && p.isActive)
  },

  async getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCategories
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const newProduct: Product = {
      id: String(Date.now()),
      name: data.name ?? '',
      slug: data.name?.toLowerCase().replace(/\s+/g, '-') ?? '',
      description: data.description ?? '',
      price: data.price ?? 0,
      originalPrice: data.originalPrice,
      images: data.images ?? [],
      category: data.category ?? mockCategories[0],
      stock: data.stock ?? 0,
      rating: 0,
      reviewsCount: 0,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Produto não encontrado')
    mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() }
    return mockProducts[index]
  },

  async deleteProduct(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Produto não encontrado')
    mockProducts.splice(index, 1)
  },
}
