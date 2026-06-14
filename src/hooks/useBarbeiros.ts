import { useCallback, useEffect, useMemo, useState } from 'react'
import { barbeiroService } from '@/services/barbeiros/barbeiroService'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

export function useBarbeiros(empresaId: string) {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await barbeiroService.list(empresaId)
      setBarbeiros(data)
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
      const novo = await barbeiroService.create(empresaId, data)
      setBarbeiros((prev) => [...prev, novo])
      return novo
    },
    [empresaId],
  )

  const updateBarbeiro = useCallback(
    async (id: string, data: BarbeiroFormData) => {
      const atualizado = await barbeiroService.update(empresaId, id, data)
      setBarbeiros((prev) =>
        prev.map((b) => (b.id === id ? atualizado : b)),
      )
    },
    [empresaId],
  )

  const deleteBarbeiro = useCallback(async (id: string) => {
    await barbeiroService.delete(id)
    setBarbeiros((prev) => prev.filter((b) => b.id !== id))
  }, [])

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
