import { useCallback, useEffect, useState } from 'react'
import { servicoService } from '@/services/servicos/servicoService'
import type { Servico, ServicoFormData } from '@/types/servico'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export interface UseServicosOptions {
  all?: boolean
}

export function useServicos(empresaId: string, options: UseServicosOptions = {}) {
  const all = options.all ?? false
  const [servicos, setServicos] = useState<Servico[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadServicos = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      if (all) {
        const data = await servicoService.listAll(empresaId, search || undefined)
        setServicos(data)
        setTotal(data.length)
      } else {
        const result = await servicoService.listPaged(
          empresaId,
          page,
          pageSize,
          search || undefined,
        )
        setServicos(result.items)
        setTotal(result.total)
      }
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, all, page, pageSize, search])

  useEffect(() => {
    loadServicos()
  }, [loadServicos])

  useEffect(() => {
    if (!all) setPage(1)
  }, [search, all])

  const createServico = useCallback(
    async (data: ServicoFormData) => {
      const novo = await servicoService.create(empresaId, data)
      if (all) {
        setServicos((prev) => [...prev, novo])
        setTotal((prev) => prev + 1)
      } else {
        await loadServicos()
      }
      return novo
    },
    [empresaId, all, loadServicos],
  )

  const updateServico = useCallback(
    async (id: string, data: ServicoFormData) => {
      const atualizado = await servicoService.update(empresaId, id, data)
      setServicos((prev) => prev.map((s) => (s.id === id ? atualizado : s)))
      return atualizado
    },
    [empresaId],
  )

  const deleteServico = useCallback(
    async (id: string) => {
      await servicoService.delete(id)
      if (!all && servicos.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await loadServicos()
      }
    },
    [all, servicos.length, page, loadServicos],
  )

  return {
    servicos,
    total,
    page,
    pageSize,
    setPage,
    search,
    setSearch,
    isLoading,
    createServico,
    updateServico,
    deleteServico,
  }
}
