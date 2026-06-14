import { useCallback, useEffect, useState } from 'react'
import {
  dashboardService,
  type DashboardData,
} from '@/services/dashboard/dashboardService'

export function useDashboard(empresaId: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const result = await dashboardService.getData(empresaId)
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    load()
  }, [load])

  return { data, isLoading, reload: load }
}
