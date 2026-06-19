import { useCallback, useEffect, useMemo, useState } from 'react'
import { barbeiroService } from '@/services/barbeiros/barbeiroService'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

function sortByOrdem(barbeiros: Barbeiro[]) {
  return [...barbeiros].sort(
    (a, b) => a.ordemExibicao - b.ordemExibicao || a.nome.localeCompare(b.nome),
  )
}

export function useBarbeiros(empresaId: string) {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await barbeiroService.list(empresaId)
      setBarbeiros(sortByOrdem(data))
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    load()
  }, [load])

  const filteredBarbeiros = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return barbeiros
    return barbeiros.filter((b) => b.nome.toLowerCase().includes(term))
  }, [barbeiros, search])

  const createBarbeiro = useCallback(
    async (data: BarbeiroFormData) => {
      await barbeiroService.create(empresaId, data)
      await load()
    },
    [empresaId, load],
  )

  const updateBarbeiro = useCallback(
    async (id: string, data: BarbeiroFormData) => {
      await barbeiroService.update(empresaId, id, data)
      await load()
    },
    [empresaId, load],
  )

  const deleteBarbeiro = useCallback(
    async (id: string) => {
      await barbeiroService.delete(id)
      await load()
    },
    [load],
  )

  return {
    barbeiros: filteredBarbeiros,
    total: barbeiros.length,
    search,
    setSearch,
    isLoading,
    createBarbeiro,
    updateBarbeiro,
    deleteBarbeiro,
    reload: load,
  }
}
