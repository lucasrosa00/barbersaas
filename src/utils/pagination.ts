import type { PaginationParams } from '@/types/pagination'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export function buildPaginationQuery(
  params: Partial<PaginationParams> & { all?: boolean },
  extra: Record<string, string | number | undefined | null> = {},
): string {
  const searchParams = new URLSearchParams()

  if (params.all) {
    searchParams.set('all', 'true')
  } else {
    searchParams.set('page', String(params.page ?? 1))
    searchParams.set('pageSize', String(params.pageSize ?? DEFAULT_PAGE_SIZE))
  }

  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getPaginationRange(
  page: number,
  pageSize: number,
  total: number,
): { from: number; to: number } {
  if (total === 0) return { from: 0, to: 0 }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return { from, to }
}

export function getTotalPages(total: number, pageSize: number): number {
  if (total === 0) return 1
  return Math.ceil(total / pageSize)
}
