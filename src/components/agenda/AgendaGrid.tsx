import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { labels } from '@/constants/terminology'
import type { Barbeiro } from '@/types/barbeiro'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import type { BloqueioHorario } from '@/types/bloqueioHorario'
import type { Servico } from '@/types/servico'
import { AgendamentoCard } from '@/components/agenda/AgendamentoCard'
import { BloqueioAgendaCard } from '@/components/agenda/BloqueioAgendaCard'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  canPlaceAgendamentoAt,
  getAgendaDisplayRange,
  getAgendaTotalHeight,
  getBloqueiosAplicaveis,
  getClickableHorarios,
  getHeightFromDuracao,
  getHorarioFromTop,
  getSlots,
  getTopFromHorario,
  isSlotWithinWorkingHours,
  SLOT_HEIGHT_PX,
} from '@/utils/agenda'
import { timeToMinutes } from '@/utils/timeSlots'
import type { IntervaloSlot } from '@/types/empresaConfig'

const DRAG_THRESHOLD_PX = 5

const DRAGGABLE_STATUS = new Set([
  'agendado',
  'confirmado',
  'em_atendimento',
])

interface DropPreview {
  barbeiroId: string
  horario: string
  valid: boolean
}

interface AgendaGridProps {
  barbeiros: Barbeiro[]
  agendamentos: AgendamentoEnriquecido[]
  bloqueios: BloqueioHorario[]
  servicos: Servico[]
  data: string
  intervaloSlots: IntervaloSlot
  agendaInicio?: string
  agendaFim?: string
  onSlotClick: (barbeiroId: string, horario: string) => void
  onAgendamentoClick: (agendamento: AgendamentoEnriquecido) => void
  onAgendamentoMove: (
    agendamento: AgendamentoEnriquecido,
    barbeiroId: string,
    horario: string,
  ) => void
}

export function AgendaGrid({
  barbeiros,
  agendamentos,
  bloqueios,
  servicos,
  data,
  intervaloSlots,
  agendaInicio,
  agendaFim,
  onSlotClick,
  onAgendamentoClick,
  onAgendamentoMove,
}: AgendaGridProps) {
  const { inicio: gridInicio, fim: gridFim } = useMemo(
    () => getAgendaDisplayRange(barbeiros, agendamentos, agendaInicio, agendaFim),
    [barbeiros, agendamentos, agendaInicio, agendaFim],
  )
  const slots = getSlots(gridInicio, gridFim)
  const totalHeight = getAgendaTotalHeight(gridInicio, gridFim)
  const singleColumn = barbeiros.length === 1
  /** Mouse/trackpad — evita conflito com scroll da página no touch */
  const canDrag = useMediaQuery('(pointer: fine)')

  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dragState = useRef<{
    agendamento: AgendamentoEnriquecido
    startX: number
    startY: number
    moved: boolean
  } | null>(null)

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [pointerActive, setPointerActive] = useState(false)
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null)
  const dropPreviewRef = useRef<DropPreview | null>(null)

  useEffect(() => {
    dropPreviewRef.current = dropPreview
  }, [dropPreview])

  const evaluateDrop = useCallback(
    (agendamento: AgendamentoEnriquecido, barbeiroId: string, horario: string) => {
      const barbeiro = barbeiros.find((b) => b.id === barbeiroId)
      const servico = servicos.find((s) => s.id === agendamento.servicoId)

      if (!barbeiro) return false
      if (!servico?.barbeirosDisponiveis.includes(barbeiroId)) return false
      if (
        agendamento.barbeiroId === barbeiroId &&
        agendamento.horario === horario
      ) {
        return false
      }

      return canPlaceAgendamentoAt(
        agendamentos,
        data,
        barbeiro,
        horario,
        agendamento.duracaoMinutos,
        agendamento.id,
        bloqueios,
      )
    },
    [agendamentos, barbeiros, bloqueios, data, servicos],
  )

  const findColumnAtPoint = useCallback(
    (clientX: number, clientY: number) => {
      for (const barbeiro of barbeiros) {
        const el = columnRefs.current.get(barbeiro.id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return { barbeiro, rect }
        }
      }
      return null
    },
    [barbeiros],
  )

  const updateDropPreview = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragState.current
      if (!drag) return

      const column = findColumnAtPoint(clientX, clientY)
      if (!column) {
        setDropPreview(null)
        return
      }

      const topPx = Math.max(0, clientY - column.rect.top)
      const horario = getHorarioFromTop(topPx, gridInicio)
      const valid = evaluateDrop(drag.agendamento, column.barbeiro.id, horario)

      setDropPreview({
        barbeiroId: column.barbeiro.id,
        horario,
        valid,
      })
    },
    [evaluateDrop, findColumnAtPoint, gridInicio],
  )

  useEffect(() => {
    if (!pointerActive || !canDrag) return

    function handlePointerMove(e: PointerEvent) {
      const drag = dragState.current
      if (!drag) return

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) {
        drag.moved = true
      }

      if (drag.moved && DRAGGABLE_STATUS.has(drag.agendamento.status)) {
        updateDropPreview(e.clientX, e.clientY)
      }
    }

    function handlePointerUp() {
      const drag = dragState.current
      if (!drag) return

      const preview = dropPreviewRef.current

      if (
        drag.moved &&
        DRAGGABLE_STATUS.has(drag.agendamento.status) &&
        preview?.valid
      ) {
        onAgendamentoMove(
          drag.agendamento,
          preview.barbeiroId,
          preview.horario,
        )
      } else if (!drag.moved) {
        onAgendamentoClick(drag.agendamento)
      }

      dragState.current = null
      setDraggingId(null)
      setPointerActive(false)
      setDropPreview(null)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    document.body.style.userSelect = 'none'
    if (draggingId) {
      document.body.style.cursor = 'grabbing'
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [
    draggingId,
    pointerActive,
    canDrag,
    onAgendamentoClick,
    onAgendamentoMove,
    updateDropPreview,
  ])

  function handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    agendamento: AgendamentoEnriquecido,
  ) {
    if (!canDrag || e.button !== 0) return

    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = {
      agendamento,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    }
    setPointerActive(true)

    if (DRAGGABLE_STATUS.has(agendamento.status)) {
      setDraggingId(agendamento.id)
      setDropPreview(null)
    }
  }

  const draggingAgendamento = draggingId
    ? agendamentos.find((a) => a.id === draggingId)
    : undefined

  if (barbeiros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          {labels.professional.noneForAgenda}
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

          {barbeiros.map((barbeiro) => {
            const barbeiroAgendamentos = agendamentos
              .filter(
                (a) =>
                  a.barbeiroId === barbeiro.id && a.status !== 'cancelado',
              )
              .sort((a, b) => a.horario.localeCompare(b.horario))
            const clickableHorarios = getClickableHorarios(
              barbeiro,
              agendamentos,
              data,
              intervaloSlots,
              bloqueios,
            )
            const bloqueiosDoDia = getBloqueiosAplicaveis(
              bloqueios,
              data,
              barbeiro.id,
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

                <div
                  ref={(el) => {
                    if (el) columnRefs.current.set(barbeiro.id, el)
                    else columnRefs.current.delete(barbeiro.id)
                  }}
                  className="relative bg-neutral-50"
                  style={{ height: totalHeight }}
                >
                  {slots.map((slot, index) => {
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
                      />
                    )
                  })}

                  {clickableHorarios.map((horario) => (
                    <button
                      key={horario}
                      type="button"
                      onClick={() => onSlotClick(barbeiro.id, horario)}
                      className="group absolute z-[2] flex w-full items-start justify-center opacity-100 transition-opacity sm:opacity-0 sm:hover:opacity-100"
                      style={{
                        top: getTopFromHorario(horario, gridInicio),
                        height: SLOT_HEIGHT_PX,
                      }}
                      aria-label={`Agendar ${horario} com ${barbeiro.nome}`}
                    >
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500 group-hover:text-neutral-900">
                        +
                      </span>
                    </button>
                  ))}

                  {dropPreview?.barbeiroId === barbeiro.id && draggingAgendamento && (
                    <div
                      className={`pointer-events-none absolute px-0.5 ${
                        dropPreview.valid
                          ? 'border-2 border-dashed border-emerald-400 bg-emerald-100/40'
                          : 'border-2 border-dashed border-red-400 bg-red-100/40'
                      }`}
                      style={{
                        top: getTopFromHorario(dropPreview.horario, gridInicio),
                        height: getHeightFromDuracao(
                          draggingAgendamento.duracaoMinutos,
                        ),
                        left: 0,
                        right: 0,
                        zIndex: 40,
                      }}
                    />
                  )}

                  {bloqueiosDoDia.map((bloqueio, index) => {
                    const duracao =
                      timeToMinutes(bloqueio.horarioFim) -
                      timeToMinutes(bloqueio.horarioInicio)

                    return (
                      <div
                        key={bloqueio.id}
                        className="pointer-events-none absolute px-0.5"
                        style={{
                          top: getTopFromHorario(bloqueio.horarioInicio, gridInicio),
                          height: getHeightFromDuracao(duracao),
                          left: 0,
                          right: 0,
                          zIndex: 5 + index,
                        }}
                      >
                        <BloqueioAgendaCard bloqueio={bloqueio} />
                      </div>
                    )
                  })}

                  {barbeiroAgendamentos.map((ag, index) => {
                    const isDragging = draggingId === ag.id
                    const isDraggable =
                      canDrag && DRAGGABLE_STATUS.has(ag.status)

                    return (
                      <div
                        key={ag.id}
                        role="button"
                        tabIndex={0}
                        className={`absolute px-0.5 ${
                          isDraggable
                            ? 'touch-none cursor-grab active:cursor-grabbing'
                            : 'cursor-pointer'
                        } ${isDragging ? 'opacity-40' : ''}`}
                        style={{
                          top: getTopFromHorario(ag.horario, gridInicio),
                          height: getHeightFromDuracao(ag.duracaoMinutos),
                          left: 0,
                          right: 0,
                          zIndex: isDragging ? 40 : 10 + index,
                        }}
                        onPointerDown={
                          isDraggable
                            ? (e) => handlePointerDown(e, ag)
                            : undefined
                        }
                        onClick={
                          !canDrag
                            ? () => onAgendamentoClick(ag)
                            : undefined
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onAgendamentoClick(ag)
                          }
                        }}
                      >
                        <AgendamentoCard agendamento={ag} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
