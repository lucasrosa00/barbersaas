import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useNotificacoes } from '@/hooks/useNotificacoes'
import type { Notificacao } from '@/types/notificacao'

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `Há ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Há ${hours}h`

  const days = Math.floor(hours / 24)
  return `Há ${days} dia${days === 1 ? '' : 's'}`
}

export function NotificationBell() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const { notificacoes, naoLidas, isLoading, marcarComoLida, marcarTodasComoLidas } =
    useNotificacoes()

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function handleNotificationClick(notificacao: Notificacao) {
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id)
    }

    setOpen(false)

    if (notificacao.agendamentoData) {
      navigate('/agenda', {
        state: { selectedDate: notificacao.agendamentoData },
      })
      return
    }

    navigate('/agenda')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="Notificações"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Notificações</p>
              {naoLidas > 0 && (
                <p className="text-xs text-neutral-500">{naoLidas} não lida(s)</p>
              )}
            </div>
            {naoLidas > 0 && (
              <button
                type="button"
                onClick={marcarTodasComoLidas}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-center text-sm text-neutral-500">Carregando...</p>
            ) : notificacoes.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-neutral-500">
                Nenhuma notificação por enquanto.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {notificacoes.map((notificacao) => (
                  <li key={notificacao.id}>
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notificacao)}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${
                        !notificacao.lida ? 'bg-neutral-50/80' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notificacao.lida && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}
                        <div className={!notificacao.lida ? '' : 'pl-5'}>
                          <p className="text-sm font-medium text-neutral-900">
                            {notificacao.titulo}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                            {notificacao.mensagem}
                          </p>
                          <p className="mt-1 text-[11px] text-neutral-400">
                            {formatRelativeTime(notificacao.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
