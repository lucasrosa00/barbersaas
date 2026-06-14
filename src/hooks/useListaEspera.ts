import { useCallback, useEffect, useState } from 'react'
import { listaEsperaService } from '@/services/listaEspera/listaEsperaService'
import type { ListaEsperaFormData, ListaEsperaItem } from '@/types/listaEspera'

export function useListaEspera(empresaId: string) {
  const [itens, setItens] = useState<ListaEsperaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await listaEsperaService.list(empresaId)
      setItens(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    load()
  }, [load])

  const addItem = useCallback(
    async (data: ListaEsperaFormData) => {
      const novo = await listaEsperaService.create(empresaId, data)
      setItens((prev) => [...prev, novo].sort((a, b) => a.posicao - b.posicao))
      return novo
    },
    [empresaId],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await listaEsperaService.remove(id)
      await load()
    },
    [load],
  )

  const moveUp = useCallback(
    async (id: string) => {
      const updated = await listaEsperaService.moveUp(empresaId, id)
      setItens(updated)
    },
    [empresaId],
  )

  const moveDown = useCallback(
    async (id: string) => {
      const updated = await listaEsperaService.moveDown(empresaId, id)
      setItens(updated)
    },
    [empresaId],
  )

  return {
    itens,
    isLoading,
    addItem,
    removeItem,
    moveUp,
    moveDown,
    reload: load,
  }
}
