import { useCallback, useEffect, useMemo, useState } from 'react'
import { clienteService } from '@/services/clientes/clienteService'
import type { Cliente, ClienteFormData } from '@/types/cliente'

export function useClientes(empresaId: string) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await clienteService.list(empresaId, search)
      setClientes(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, search])

  useEffect(() => {
    load()
  }, [load])

  const filteredClientes = useMemo(() => clientes, [clientes])

  const createCliente = useCallback(
    async (data: ClienteFormData) => {
      const novo = await clienteService.create(empresaId, data)
      setClientes((prev) => [...prev, novo])
      return novo
    },
    [empresaId],
  )

  const updateCliente = useCallback(
    async (id: string, data: ClienteFormData) => {
      const atualizado = await clienteService.update(empresaId, id, data)
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? atualizado : c)),
      )
    },
    [empresaId],
  )

  const deleteCliente = useCallback(async (id: string) => {
    await clienteService.delete(id)
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return {
    clientes: filteredClientes,
    total: clientes.length,
    search,
    setSearch,
    isLoading,
    createCliente,
    updateCliente,
    deleteCliente,
    reload: load,
  }
}
