import { useCallback, useEffect, useState } from 'react'
import { clienteService } from '@/services/clientes/clienteService'
import type { Cliente, ClienteFormData } from '@/types/cliente'
import { DEFAULT_PAGE_SIZE } from '@/types/pagination'

export interface UseClientesOptions {
  all?: boolean
}

export function useClientes(empresaId: string, options: UseClientesOptions = {}) {
  const all = options.all ?? false
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      if (all) {
        const data = await clienteService.listAll(empresaId, search || undefined)
        setClientes(data)
        setTotal(data.length)
      } else {
        const result = await clienteService.listPaged(
          empresaId,
          page,
          pageSize,
          search || undefined,
        )
        setClientes(result.items)
        setTotal(result.total)
      }
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, all, page, pageSize, search])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!all) setPage(1)
  }, [search, all])

  const createCliente = useCallback(
    async (data: ClienteFormData) => {
      const novo = await clienteService.create(empresaId, data)
      if (all) {
        setClientes((prev) => [...prev, novo])
        setTotal((prev) => prev + 1)
      } else {
        await load()
      }
      return novo
    },
    [empresaId, all, load],
  )

  const updateCliente = useCallback(
    async (id: string, data: ClienteFormData) => {
      const atualizado = await clienteService.update(empresaId, id, data)
      setClientes((prev) => prev.map((c) => (c.id === id ? atualizado : c)))
    },
    [empresaId],
  )

  const deleteCliente = useCallback(
    async (id: string) => {
      await clienteService.delete(id)
      if (!all && clientes.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await load()
      }
    },
    [all, clientes.length, page, load],
  )

  return {
    clientes,
    total,
    page,
    pageSize,
    setPage,
    search,
    setSearch,
    isLoading,
    createCliente,
    updateCliente,
    deleteCliente,
    reload: load,
  }
}
