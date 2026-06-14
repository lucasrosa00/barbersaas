import { useCallback, useEffect, useMemo, useState } from 'react'
import { servicoService } from '@/services/servicos/servicoService'
import type { Servico, ServicoFormData } from '@/types/servico'

export function useServicos(empresaId: string) {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadServicos = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await servicoService.list(empresaId)
      setServicos(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    loadServicos()
  }, [loadServicos])

  const filteredServicos = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return servicos
    return servicos.filter((s) => s.nome.toLowerCase().includes(term))
  }, [servicos, search])

  const createServico = useCallback(
    async (data: ServicoFormData) => {
      const novo = await servicoService.create(empresaId, data)
      setServicos((prev) => [...prev, novo])
      return novo
    },
    [empresaId],
  )

  const updateServico = useCallback(
    async (id: string, data: ServicoFormData) => {
      const atualizado = await servicoService.update(empresaId, id, data)
      setServicos((prev) => prev.map((s) => (s.id === id ? atualizado : s)))
      return atualizado
    },
    [empresaId],
  )

  const deleteServico = useCallback(async (id: string) => {
    await servicoService.delete(id)
    setServicos((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return {
    servicos: filteredServicos,
    total: servicos.length,
    search,
    setSearch,
    isLoading,
    createServico,
    updateServico,
    deleteServico,
  }
}
