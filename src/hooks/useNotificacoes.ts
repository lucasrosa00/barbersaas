import { useCallback, useEffect, useState } from 'react'
import { notificacaoService } from '@/services/notificacoes/notificacaoService'
import type { Notificacao } from '@/types/notificacao'

const POLL_INTERVAL_MS = 30_000

export function useNotificacoes(enabled = true) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [naoLidas, setNaoLidas] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!enabled) return

    try {
      const [items, count] = await Promise.all([
        notificacaoService.list(),
        notificacaoService.getNaoLidasCount(),
      ])
      setNotificacoes(items)
      setNaoLidas(count)
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    reload()
    const interval = window.setInterval(reload, POLL_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [enabled, reload])

  const marcarComoLida = useCallback(
    async (id: string) => {
      await notificacaoService.marcarComoLida(id)
      setNotificacoes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, lida: true } : item)),
      )
      setNaoLidas((prev) => Math.max(0, prev - 1))
    },
    [],
  )

  const marcarTodasComoLidas = useCallback(async () => {
    await notificacaoService.marcarTodasComoLidas()
    setNotificacoes((prev) => prev.map((item) => ({ ...item, lida: true })))
    setNaoLidas(0)
  }, [])

  return {
    notificacoes,
    naoLidas,
    isLoading,
    reload,
    marcarComoLida,
    marcarTodasComoLidas,
  }
}
