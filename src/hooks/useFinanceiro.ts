import { useCallback, useEffect, useState } from 'react'
import { financeiroService } from '@/services/financeiro/financeiroService'
import type { FinanceiroData, MovimentacaoFormData } from '@/types/financeiro'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export function useFinanceiro(empresaId: string) {
  const [data, setData] = useState<FinanceiroData | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(DEFAULT_PAGE_SIZE)
  const [barbeiroId, setBarbeiroId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const result = await financeiroService.getData(
        empresaId,
        page,
        pageSize,
        barbeiroId || undefined,
      )
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, page, pageSize, barbeiroId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [barbeiroId])

  async function createMovimentacao(formData: MovimentacaoFormData) {
    await financeiroService.createMovimentacao(empresaId, formData)
    setPage(1)
    await load()
  }

  async function deleteMovimentacao(id: string) {
    await financeiroService.deleteMovimentacao(id)
    if (data && data.movimentacoes.items.length === 1 && page > 1) {
      setPage((prev) => prev - 1)
    } else {
      await load()
    }
  }

  return {
    data,
    isLoading,
    page,
    pageSize,
    setPage,
    barbeiroId,
    setBarbeiroId,
    reload: load,
    createMovimentacao,
    deleteMovimentacao,
  }
}
