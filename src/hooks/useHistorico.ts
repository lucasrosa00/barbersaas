import { useCallback, useEffect, useState } from 'react'
import { historicoService } from '@/services/historico/historicoService'
import type { HistoricoAtendimento, HistoricoFiltros } from '@/types/historico'
import { historicoFiltrosVazios } from '@/types/historico'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export function useHistorico(empresaId: string) {
  const [registros, setRegistros] = useState<HistoricoAtendimento[]>([])
  const [total, setTotal] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)
  const [filtros, setFiltros] = useState<HistoricoFiltros>(historicoFiltrosVazios)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(DEFAULT_PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const [result, totalFaturado] = await Promise.all([
        historicoService.listPaged(empresaId, page, pageSize, filtros),
        historicoService.getTotal(filtros),
      ])

      setRegistros(result.items)
      setTotal(result.total)
      setValorTotal(totalFaturado)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, page, pageSize, filtros])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [filtros])

  function limparFiltros() {
    setFiltros(historicoFiltrosVazios)
  }

  function updateFiltro<K extends keyof HistoricoFiltros>(
    key: K,
    value: HistoricoFiltros[K],
  ) {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  return {
    registros,
    total,
    valorTotal,
    filtros,
    page,
    pageSize,
    setPage,
    isLoading,
    setFiltros,
    updateFiltro,
    limparFiltros,
    reload: load,
  }
}
