import {
  getAgendaStatusStyles,
  getStatusLabel,
} from '@/constants/agendamentoStatus'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import { formatHorarioIntervalo } from '@/utils/agenda'

interface AgendamentoCardProps {
  agendamento: AgendamentoEnriquecido
  onClick: (agendamento: AgendamentoEnriquecido) => void
  compact?: boolean
}

export function AgendamentoCard({
  agendamento,
  onClick,
  compact = false,
}: AgendamentoCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(agendamento)}
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg border text-left transition-colors hover:brightness-[1.03] ${getAgendaStatusStyles(agendamento.status)} ${compact ? 'p-1.5' : 'p-2'}`}
    >
      <p className={`truncate font-semibold ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {agendamento.clienteNome}
      </p>
      {!compact && (
        <p className="mt-0.5 truncate text-[10px] opacity-80">
          {agendamento.servicoNome}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-1 pt-0.5">
        <span className="truncate text-[9px] font-medium uppercase tracking-wide opacity-70">
          {getStatusLabel(agendamento.status)}
        </span>
        <span className="shrink-0 text-[9px] opacity-60">
          {formatHorarioIntervalo(
            agendamento.horario,
            agendamento.duracaoMinutos,
          )}
        </span>
      </div>
    </button>
  )
}
