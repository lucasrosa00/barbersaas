import { useCallback, useEffect, useState } from 'react'
import { clienteService } from '@/services/clientes/clienteService'
import type { Aniversariante } from '@/types/cliente'

export function useAniversariantes(empresaId: string) {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([])
  const [mes, setMes] = useState(() => new Date().getMonth() + 1)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await clienteService.listAniversariantes(empresaId, mes)
      setAniversariantes(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, mes])

  useEffect(() => {
    load()
  }, [load])

  return {
    aniversariantes,
    mes,
    setMes,
    isLoading,
    reload: load,
  }
}
