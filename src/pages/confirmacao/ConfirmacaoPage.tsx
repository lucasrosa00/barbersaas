import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarCheck, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getStatusLabel } from '@/constants/agendamentoStatus'
import { labels } from '@/constants/terminology'
import {
  confirmacaoService,
  type ConfirmacaoAgendamento,
} from '@/services/confirmacao/confirmacaoService'
import { ApiError } from '@/services/api/client'
import { formatDateBR } from '@/utils/formatDate'
import { formatHorarioIntervalo } from '@/utils/agenda'

type PageState = 'loading' | 'ready' | 'confirming' | 'success' | 'error'

export function ConfirmacaoPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<PageState>('loading')
  const [agendamento, setAgendamento] = useState<ConfirmacaoAgendamento | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) {
      setError('Link de confirmação inválido.')
      setState('error')
      return
    }

    setState('loading')
    setError(null)

    try {
      const data = await confirmacaoService.getByToken(token)
      setAgendamento(data)
      setMessage(data.mensagem ?? null)
      setState('ready')
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar o agendamento.'
      setError(msg)
      setState('error')
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function handleConfirmar() {
    if (!token || !agendamento?.podeConfirmar) return

    setState('confirming')
    setError(null)

    try {
      const result = await confirmacaoService.confirmar(token)
      setMessage(result.mensagem)
      setAgendamento((prev) =>
        prev
          ? {
              ...prev,
              status: result.status,
              podeConfirmar: false,
              mensagem: result.mensagem,
            }
          : prev,
      )
      setState('success')
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível confirmar sua presença.'
      setError(msg)
      setState('ready')
    }
  }

  const intervalo =
    agendamento?.horario && agendamento.duracaoMinutos
      ? formatHorarioIntervalo(agendamento.horario, agendamento.duracaoMinutos)
      : null

  const jaConfirmado =
    agendamento?.status === 'confirmado' || state === 'success'

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900">
            <CalendarCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Confirmação de presença
            </p>
            <h1 className="text-lg font-semibold text-neutral-900">
              {agendamento?.empresaNome ?? labels.appName}
            </h1>
          </div>
        </div>

        {state === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-10 text-neutral-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Carregando agendamento...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-4 py-4 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-400" />
            <p className="text-sm text-neutral-700">{error}</p>
          </div>
        )}

        {agendamento && state !== 'loading' && state !== 'error' && (
          <div className="space-y-5">
            <p className="text-sm text-neutral-600">
              Olá, <span className="font-medium text-neutral-900">{agendamento.clientePrimeiroNome}</span>!
              Confira os detalhes do seu agendamento:
            </p>

            <dl className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Data</dt>
                <dd className="font-medium text-neutral-900">{formatDateBR(agendamento.data)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Horário</dt>
                <dd className="font-medium text-neutral-900">{intervalo}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Serviço</dt>
                <dd className="text-right font-medium text-neutral-900">{agendamento.servicoNome}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{labels.professional.one}</dt>
                <dd className="text-right font-medium text-neutral-900">{agendamento.barbeiroNome}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3">
                <dt className="text-neutral-500">Status</dt>
                <dd className="font-medium text-neutral-900">{getStatusLabel(agendamento.status)}</dd>
              </div>
            </dl>

            {message && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  jaConfirmado
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-amber-50 text-amber-800'
                }`}
              >
                {jaConfirmado ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : null}
                <span>{message}</span>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
            )}

            {agendamento.podeConfirmar && (
              <Button
                type="button"
                className="w-full"
                isLoading={state === 'confirming'}
                onClick={handleConfirmar}
              >
                Confirmar presença
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
