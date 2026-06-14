import { useCallback, useEffect, useState } from 'react'
import { financeiroService } from '@/services/financeiro/financeiroService'
import type { FinanceiroData, MovimentacaoFormData } from '@/types/financeiro'

export function useFinanceiro(empresaId: string) {
  const [data, setData] = useState<FinanceiroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const result = await financeiroService.getData(empresaId)
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    load()
  }, [load])

  async function createMovimentacao(formData: MovimentacaoFormData) {
    await financeiroService.createMovimentacao(empresaId, formData)
    await load()
  }

  return { data, isLoading, reload: load, createMovimentacao }
}
