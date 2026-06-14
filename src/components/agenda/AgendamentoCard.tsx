import {
  getAgendaStatusStyles,
  getStatusLabel,
} from '@/constants/agendamentoStatus'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import {
  AGENDA_SLOT_MINUTES,
  formatHorarioIntervalo,
  getHorarioFim,
} from '@/utils/agenda'

interface AgendamentoCardProps {
  agendamento: AgendamentoEnriquecido
  onClick: (agendamento: AgendamentoEnriquecido) => void
}

const cardBaseClass =
  'h-full w-full min-h-0 overflow-hidden rounded-md border text-left shadow-sm transition-all hover:brightness-[1.02] hover:shadow'

function TimeColumn({ inicio, fim }: { inicio: string; fim: string }) {
  return (
    <div className="flex w-[4.25rem] shrink-0 flex-col items-end justify-center gap-0.5 border-l border-current/10 px-2 py-1">
      <span className="text-[10px] font-semibold tabular-nums leading-none">
        {inicio}
      </span>
      <span className="text-[8px] leading-none opacity-30">—</span>
      <span className="text-[10px] font-semibold tabular-nums leading-none">
        {fim}
      </span>
    </div>
  )
}

export function AgendamentoCard({
  agendamento,
  onClick,
}: AgendamentoCardProps) {
  const horarioFim = getHorarioFim(
    agendamento.horario,
    agendamento.duracaoMinutos,
  )
  const intervalo = formatHorarioIntervalo(
    agendamento.horario,
    agendamento.duracaoMinutos,
  )
  const statusLabel = getStatusLabel(agendamento.status)
  const title = `${agendamento.clienteNome} - ${agendamento.servicoNome} - ${statusLabel} - ${intervalo}`
  const isShort = agendamento.duracaoMinutos < AGENDA_SLOT_MINUTES

  return (
    <button
      type="button"
      title={title}
      onClick={() => onClick(agendamento)}
      className={`${cardBaseClass} ${getAgendaStatusStyles(agendamento.status)}`}
    >
      {isShort ? (
        <div className="flex h-full items-center gap-1.5 px-1.5 py-0">
          <p className="flex min-w-0 flex-1 items-center gap-1 truncate leading-none">
            <span className="truncate text-[11px] font-semibold">
              {agendamento.clienteNome}
            </span>
            <span className="shrink-0 text-[10px] opacity-40">·</span>
            <span className="truncate text-[10px] opacity-80">
              {agendamento.servicoNome}
            </span>
            <span className="shrink-0 text-[10px] opacity-40">·</span>
            <span className="shrink-0 text-[8px] font-semibold uppercase tracking-wide opacity-70">
              {statusLabel}
            </span>
          </p>
          <span className="shrink-0 text-right text-[9px] font-semibold tabular-nums leading-none opacity-75">
            {intervalo}
          </span>
        </div>
      ) : (
        <div className="flex h-full w-full">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-2 py-1">
            <p className="truncate text-xs font-semibold leading-tight">
              {agendamento.clienteNome}
            </p>
            <p className="truncate text-[10px] leading-tight opacity-80">
              {agendamento.servicoNome}
            </p>
            <span className="truncate text-[8px] font-semibold uppercase tracking-wide opacity-70">
              {statusLabel}
            </span>
          </div>
          <TimeColumn inicio={agendamento.horario} fim={horarioFim} />
        </div>
      )}
    </button>
  )
}
