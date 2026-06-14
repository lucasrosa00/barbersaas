import type { Barbeiro } from '@/types/barbeiro'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import { AgendamentoCard } from '@/components/agenda/AgendamentoCard'
import {
  AGENDA_SLOT_MINUTES,
  getAgendaTotalHeight,
  getHeightFromDuracao,
  getSlots,
  getTopFromHorario,
  isSlotOccupied,
  isSlotWithinWorkingHours,
  SLOT_HEIGHT_PX,
} from '@/utils/agenda'

interface AgendaGridProps {
  barbeiros: Barbeiro[]
  agendamentos: AgendamentoEnriquecido[]
  onSlotClick: (barbeiroId: string, horario: string) => void
  onAgendamentoClick: (agendamento: AgendamentoEnriquecido) => void
}

export function AgendaGrid({
  barbeiros,
  agendamentos,
  onSlotClick,
  onAgendamentoClick,
}: AgendaGridProps) {
  const slots = getSlots()
  const totalHeight = getAgendaTotalHeight()
  const singleColumn = barbeiros.length === 1

  if (barbeiros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Nenhum barbeiro cadastrado para exibir a agenda.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <div
        className={
          singleColumn
            ? 'w-full'
            : '-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0'
        }
      >
        <div className={singleColumn ? 'flex w-full' : 'flex min-w-max'}>
          {/* Coluna de horários */}
          <div className="w-14 shrink-0 border-r border-neutral-200 bg-white sm:w-16">
            <div className="h-14 border-b border-neutral-200" />
            <div className="relative" style={{ height: totalHeight }}>
              {slots.map((slot, index) => {
                const minutes = slot.split(':')[1]
                const showLabel = minutes === '00' || minutes === '30'

                return (
                  <div
                    key={slot}
                    className="absolute right-0 left-0 border-b border-neutral-200 pr-2 text-right"
                    style={{
                      top: index * SLOT_HEIGHT_PX,
                      height: SLOT_HEIGHT_PX,
                    }}
                  >
                    {showLabel && (
                      <span className="text-[10px] font-medium text-neutral-500">
                        {slot}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Colunas dos barbeiros */}
          {barbeiros.map((barbeiro) => {
            const barbeiroAgendamentos = agendamentos.filter(
              (a) => a.barbeiroId === barbeiro.id,
            )

            return (
              <div
                key={barbeiro.id}
                className={
                  singleColumn
                    ? 'min-w-0 flex-1'
                    : 'min-w-[132px] flex-1 border-r border-neutral-200 last:border-r-0 sm:min-w-[180px]'
                }
              >
                <div className="flex h-14 flex-col items-center justify-center border-b border-neutral-200 bg-neutral-50 px-2">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {barbeiro.nome}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {barbeiro.horarioInicio} — {barbeiro.horarioFim}
                  </p>
                </div>

                <div className="relative bg-neutral-50" style={{ height: totalHeight }}>
                  {/* Slots de fundo */}
                  {slots.map((slot, index) => {
                    const occupied = isSlotOccupied(
                      agendamentos,
                      barbeiro.id,
                      slot,
                    )
                    const withinHours = isSlotWithinWorkingHours(slot, barbeiro)
                    const isHourMark = slot.endsWith(':00')

                    return (
                      <div
                        key={slot}
                        className={`absolute w-full border-b ${
                          isHourMark
                            ? 'border-neutral-200'
                            : 'border-neutral-100'
                        } ${withinHours ? '' : 'bg-neutral-100'}`}
                        style={{
                          top: index * SLOT_HEIGHT_PX,
                          height: SLOT_HEIGHT_PX,
                        }}
                      >
                        {!occupied && withinHours && (
                          <button
                            type="button"
                            onClick={() => onSlotClick(barbeiro.id, slot)}
                            className="group flex h-full min-h-[44px] w-full items-center justify-center opacity-100 transition-opacity sm:opacity-0 sm:hover:opacity-100"
                            aria-label={`Agendar ${slot} com ${barbeiro.nome}`}
                          >
                            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500 group-hover:text-neutral-900">
                              +
                            </span>
                          </button>
                        )}
                      </div>
                    )
                  })}

                  {/* Blocos de agendamento */}
                  {barbeiroAgendamentos.map((ag) => (
                    <div
                      key={ag.id}
                      className="absolute z-10 px-0.5"
                      style={{
                        top: getTopFromHorario(ag.horario),
                        height: getHeightFromDuracao(ag.duracaoMinutos),
                        left: 0,
                        right: 0,
                      }}
                    >
                      <AgendamentoCard
                        agendamento={ag}
                        onClick={onAgendamentoClick}
                        compact={ag.duracaoMinutos <= AGENDA_SLOT_MINUTES * 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
