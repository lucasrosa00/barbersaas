export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export const DEFAULT_PAGE_SIZE = 10
