import type { PagedResult } from '@/types/pagination'

interface PagedApiResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export function mapPagedResult<T>(data: PagedApiResponse<T>): PagedResult<T> {
  return {
    items: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
  }
}
