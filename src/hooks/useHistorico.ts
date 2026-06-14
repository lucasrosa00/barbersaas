import { useCallback, useEffect, useState } from 'react'
import { historicoService } from '@/services/historico/historicoService'
import type { HistoricoAtendimento, HistoricoFiltros } from '@/types/historico'
import { historicoFiltrosVazios } from '@/types/historico'

export function useHistorico(empresaId: string) {
  const [registros, setRegistros] = useState<HistoricoAtendimento[]>([])
  const [total, setTotal] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)
  const [filtros, setFiltros] = useState<HistoricoFiltros>(historicoFiltrosVazios)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const hasFilters = Boolean(
        filtros.clienteId ||
          filtros.barbeiroId ||
          filtros.dataInicio ||
          filtros.dataFim,
      )

      const [data, totalFaturado, allData] = await Promise.all([
        historicoService.list(empresaId, filtros),
        historicoService.getTotal(filtros),
        hasFilters
          ? historicoService.list(empresaId, historicoFiltrosVazios)
          : Promise.resolve(null),
      ])

      setRegistros(data)
      setTotal(hasFilters ? (allData?.length ?? data.length) : data.length)
      setValorTotal(totalFaturado)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, filtros])

  useEffect(() => {
    load()
  }, [load])

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
    totalFiltrado: registros.length,
    valorTotal,
    filtros,
    isLoading,
    setFiltros,
    updateFiltro,
    limparFiltros,
    reload: load,
  }
}
