import { useCallback, useEffect, useState } from 'react'
import { listaEsperaService } from '@/services/listaEspera/listaEsperaService'
import type { ListaEsperaFormData, ListaEsperaItem } from '@/types/listaEspera'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export function useListaEspera(empresaId: string) {
  const [itens, setItens] = useState<ListaEsperaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(DEFAULT_PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const result = await listaEsperaService.listPaged(empresaId, page, pageSize)
      setItens(result.items)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, page, pageSize])

  useEffect(() => {
    load()
  }, [load])

  const addItem = useCallback(
    async (data: ListaEsperaFormData) => {
      const novo = await listaEsperaService.create(empresaId, data)
      setPage(1)
      await load()
      return novo
    },
    [empresaId, load],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await listaEsperaService.remove(id)
      if (itens.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await load()
      }
    },
    [itens.length, page, load],
  )

  const moveUp = useCallback(
    async (id: string) => {
      await listaEsperaService.moveUp(id)
      await load()
    },
    [load],
  )

  const moveDown = useCallback(
    async (id: string) => {
      await listaEsperaService.moveDown(id)
      await load()
    },
    [load],
  )

  return {
    itens,
    total,
    page,
    pageSize,
    setPage,
    isLoading,
    addItem,
    removeItem,
    moveUp,
    moveDown,
    reload: load,
  }
}
