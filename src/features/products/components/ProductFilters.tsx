'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/features/products/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import type { ProductFilters } from '@/features/products/types/product.types'

interface ProductFiltersProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebounce(searchInput, 400)
  const { data: categories } = useCategories()

  function handleSearch(value: string) {
    setSearchInput(value)
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 })
  }

  function handleCategory(categoryId: string) {
    onChange({ ...filters, categoryId: categoryId || undefined, page: 1 })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar produtos..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!filters.categoryId ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategory('')}
        >
          Todos
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat.id}
            variant={filters.categoryId === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
