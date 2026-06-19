import { useCallback, useEffect, useState } from 'react'
import { bloqueioHorarioService } from '@/services/bloqueios/bloqueioHorarioService'
import type {
  BloqueioHorario,
  BloqueioHorarioFormData,
  BloqueioHorarioFiltros,
} from '@/types/bloqueioHorario'
import { bloqueioFiltrosVazios } from '@/types/bloqueioHorario'

export function useBloqueiosHorario(empresaId: string) {
  const [bloqueios, setBloqueios] = useState<BloqueioHorario[]>([])
  const [filtros, setFiltros] = useState<BloqueioHorarioFiltros>(bloqueioFiltrosVazios)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await bloqueioHorarioService.list(filtros)
      setBloqueios(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, filtros])

  useEffect(() => {
    load()
  }, [load])

  const createBloqueio = useCallback(
    async (data: BloqueioHorarioFormData) => {
      await bloqueioHorarioService.create(data)
      await load()
    },
    [load],
  )

  const updateBloqueio = useCallback(
    async (id: string, data: BloqueioHorarioFormData) => {
      await bloqueioHorarioService.update(id, data)
      await load()
    },
    [load],
  )

  const deleteBloqueio = useCallback(
    async (id: string) => {
      await bloqueioHorarioService.delete(id)
      await load()
    },
    [load],
  )

  function updateFiltro<K extends keyof BloqueioHorarioFiltros>(
    key: K,
    value: BloqueioHorarioFiltros[K],
  ) {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  function limparFiltros() {
    setFiltros(bloqueioFiltrosVazios)
  }

  return {
    bloqueios,
    filtros,
    isLoading,
    createBloqueio,
    updateBloqueio,
    deleteBloqueio,
    updateFiltro,
    limparFiltros,
    reload: load,
  }
}

export function useBloqueiosPorData(empresaId: string, data: string) {
  const [bloqueios, setBloqueios] = useState<BloqueioHorario[]>([])

  const load = useCallback(async () => {
    if (!empresaId || !data) {
      setBloqueios([])
      return
    }
    const items = await bloqueioHorarioService.listByDate(data)
    setBloqueios(items)
  }, [empresaId, data])

  useEffect(() => {
    load()
  }, [load])

  return { bloqueios, reload: load }
}
