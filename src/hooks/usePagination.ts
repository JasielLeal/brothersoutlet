import { useState } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export function usePagination({ initialPage = 1, initialLimit = 12 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  function nextPage() {
    setPage((prev) => prev + 1)
  }

  function prevPage() {
    setPage((prev) => Math.max(1, prev - 1))
  }

  function goToPage(p: number) {
    setPage(Math.max(1, p))
  }

  function reset() {
    setPage(initialPage)
  }

  return { page, limit, setLimit, nextPage, prevPage, goToPage, reset }
}
