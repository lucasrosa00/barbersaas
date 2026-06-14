import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import { formatHorarioIntervalo } from '@/utils/agenda'

interface AgendamentoMoveModalProps {
  open: boolean
  agendamento: AgendamentoEnriquecido | null
  barbeiroNome: string
  novoHorario: string
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function AgendamentoMoveModal({
  open,
  agendamento,
  barbeiroNome,
  novoHorario,
  isLoading = false,
  onClose,
  onConfirm,
}: AgendamentoMoveModalProps) {
  if (!agendamento) return null

  const horarioAtual = formatHorarioIntervalo(
    agendamento.horario,
    agendamento.duracaoMinutos,
  )
  const horarioNovo = formatHorarioIntervalo(
    novoHorario,
    agendamento.duracaoMinutos,
  )

  return (
    <Modal open={open} onClose={onClose} title="Confirmar remarcação">
      <div className="space-y-3 text-sm text-neutral-600">
        <p>
          <span className="font-medium text-neutral-900">
            {agendamento.clienteNome}
          </span>{' '}
          — {agendamento.servicoNome}
        </p>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 space-y-2">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">De</span>
            <span className="text-right text-neutral-900">
              {agendamento.barbeiroNome} · {horarioAtual}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Para</span>
            <span className="text-right font-medium text-neutral-900">
              {barbeiroNome} · {horarioNovo}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          Confirmar remarcação
        </Button>
      </div>
    </Modal>
  )
}
