import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react'
import { AgendaGrid } from '@/components/agenda/AgendaGrid'
import { AgendamentoFormModal } from '@/components/agenda/AgendamentoFormModal'
import { AgendamentoMoveModal } from '@/components/agenda/AgendamentoMoveModal'
import { NovoItemAgendaDialog } from '@/components/agenda/NovoItemAgendaDialog'
import { BloqueioHorarioFormModal } from '@/components/bloqueios/BloqueioHorarioFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { useAgendamentos } from '@/hooks/useAgendamentos'
import { useBloqueiosPorData } from '@/hooks/useBloqueiosHorario'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useClientes } from '@/hooks/useClientes'
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useServicos } from '@/hooks/useServicos'
import type {
  AgendamentoEnriquecido,
  AgendamentoFormData,
} from '@/types/agendamento'
import type { BloqueioHorarioFormData } from '@/types/bloqueioHorario'
import { labels } from '@/constants/terminology'
import { formatDateBR, formatWeekdayLong, isToday } from '@/utils/formatDate'
import { addDays, minutesToTime, timeToMinutes } from '@/utils/timeSlots'
import {
  AGENDAMENTO_STATUS,
  getAgendaStatusLegendColor,
} from '@/constants/agendamentoStatus'
import { bloqueioHorarioService } from '@/services/bloqueios/bloqueioHorarioService'
import { useHeaderActionsDispatch } from '@/contexts/HeaderActionsContext'

export function AgendaPage() {
  const { user } = useAuth()
  const location = useLocation()
  const empresaId = user?.empresaId ?? ''

  const {
    agendamentos,
    todosAgendamentos,
    selectedDate,
    setSelectedDate,
    isLoading,
    isReloading,
    createAgendamento,
    updateAgendamento,
    cancelAgendamento,
    reload: reloadAgendamentos,
  } = useAgendamentos(empresaId)

  const { barbeiros } = useBarbeiros(empresaId)
  const { bloqueios, reload: reloadBloqueios } = useBloqueiosPorData(empresaId, selectedDate)
  const { clientes, createCliente } = useClientes(empresaId, { all: true })
  const { servicos } = useServicos(empresaId, { all: true })
  const { config: empresaConfig } = useEmpresaConfig()

  const intervaloSlots = empresaConfig?.intervaloSlots ?? 15
  const agendaInicio = empresaConfig?.horarioAbertura
  const agendaFim = empresaConfig?.horarioFechamento

  const [formOpen, setFormOpen] = useState(false)
  const [editingAgendamento, setEditingAgendamento] = useState<
    AgendamentoEnriquecido | undefined
  >()
  const [prefilled, setPrefilled] = useState<Partial<AgendamentoFormData>>()
  const [bloqueioFormOpen, setBloqueioFormOpen] = useState(false)
  const [bloqueioPrefilled, setBloqueioPrefilled] = useState<
    Partial<BloqueioHorarioFormData> | undefined
  >()
  const [novoItemPrompt, setNovoItemPrompt] = useState<{
    barbeiroId?: string
    horario?: string
  } | null>(null)
  const [selectedBarbeiroId, setSelectedBarbeiroId] = useState('')
  const [pendingMove, setPendingMove] = useState<{
    agendamento: AgendamentoEnriquecido
    barbeiroId: string
    horario: string
  } | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [formKey, setFormKey] = useState('initial')
  const [remarcarPrompt, setRemarcarPrompt] = useState<{
    clienteId: string
    barbeiroId: string
    servicoId: string
    clienteNome: string
  } | null>(null)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { setActions, clearActions } = useHeaderActionsDispatch()

  function addMinutes(horario: string, minutes: number): string {
    return minutesToTime(timeToMinutes(horario) + minutes)
  }

  const handleReloadAgendamentos = useCallback(async () => {
    await Promise.all([reloadAgendamentos(), reloadBloqueios()])
  }, [reloadAgendamentos, reloadBloqueios])

  useLayoutEffect(() => {
    setActions(
      <button
        type="button"
        onClick={handleReloadAgendamentos}
        disabled={isReloading}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Recarregar agendamentos"
        title="Recarregar agendamentos"
      >
        <RefreshCw className={`h-5 w-5 ${isReloading ? 'animate-spin' : ''}`} />
      </button>,
    )

    return () => clearActions()
  }, [handleReloadAgendamentos, isReloading, setActions, clearActions])

  function openAgendamentoFromPrompt() {
    const prompt = novoItemPrompt
    setNovoItemPrompt(null)

    if (prompt?.barbeiroId && prompt?.horario) {
      handleSlotCreateAgendamento(prompt.barbeiroId, prompt.horario)
      return
    }

    handleOpenCreateAgendamento()
  }

  function openBloqueioFromPrompt() {
    const prompt = novoItemPrompt
    setNovoItemPrompt(null)

    const horarioInicio = prompt?.horario ?? '09:00'
    const horarioFim = addMinutes(horarioInicio, 60)

    setBloqueioPrefilled({
      tipo: 'pontual',
      data: selectedDate,
      horarioInicio,
      horarioFim,
      ...(prompt?.barbeiroId ? { barbeiroId: prompt.barbeiroId } : {}),
    })
    setBloqueioFormOpen(true)
  }

  useEffect(() => {
    const state = location.state as { selectedDate?: string } | null
    if (state?.selectedDate) {
      setSelectedDate(state.selectedDate)
    }
  }, [location.state, setSelectedDate])

  useEffect(() => {
    if (barbeiros.length === 0) {
      setSelectedBarbeiroId('')
      return
    }

    const barbeiroValido = barbeiros.some((b) => b.id === selectedBarbeiroId)
    if (!barbeiroValido) {
      setSelectedBarbeiroId(barbeiros[0].id)
    }
  }, [barbeiros, selectedBarbeiroId])

  const barbeirosVisiveis = useMemo(() => {
    if (isDesktop) return barbeiros
    if (!selectedBarbeiroId) return []
    return barbeiros.filter((b) => b.id === selectedBarbeiroId)
  }, [barbeiros, isDesktop, selectedBarbeiroId])

  const barbeiroSelecionado = barbeiros.find((b) => b.id === selectedBarbeiroId)

  const agendamentosAtivos = useMemo(
    () => agendamentos.filter((a) => a.status !== 'cancelado'),
    [agendamentos],
  )

  function handleOpenCreateAgendamento() {
    setEditingAgendamento(undefined)
    setFormKey(`create-${Date.now()}`)
    setPrefilled({
      data: selectedDate,
      horario: '09:00',
      status: 'agendado',
      ...(!isDesktop && selectedBarbeiroId
        ? { barbeiroId: selectedBarbeiroId }
        : {}),
    })
    setFormOpen(true)
  }

  function handleSlotCreateAgendamento(barbeiroId: string, horario: string) {
    setEditingAgendamento(undefined)
    setFormKey(`slot-${barbeiroId}-${horario}`)
    setPrefilled({
      barbeiroId,
      horario,
      data: selectedDate,
      status: 'agendado',
    })
    setFormOpen(true)
  }

  function handleOpenCreate() {
    setNovoItemPrompt({})
  }

  function handleSlotClick(barbeiroId: string, horario: string) {
    setNovoItemPrompt({ barbeiroId, horario })
  }

  function handleAgendamentoClick(agendamento: AgendamentoEnriquecido) {
    setEditingAgendamento(agendamento)
    setFormKey(agendamento.id)
    setPrefilled(undefined)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingAgendamento(undefined)
    setPrefilled(undefined)
  }

  function handleCloseBloqueioForm() {
    setBloqueioFormOpen(false)
    setBloqueioPrefilled(undefined)
  }

  async function handleSubmit(data: AgendamentoFormData) {
    const editing = editingAgendamento
    const justFinalized =
      !!editing &&
      data.status === 'finalizado' &&
      editing.status !== 'finalizado'

    if (editing) {
      await updateAgendamento(editing.id, data)
    } else {
      await createAgendamento(data)
    }

    handleCloseForm()

    if (justFinalized) {
      const clienteNome =
        clientes.find((c) => c.id === data.clienteId)?.nome ?? 'este cliente'
      setRemarcarPrompt({
        clienteId: data.clienteId,
        barbeiroId: data.barbeiroId,
        servicoId: data.servicoId,
        clienteNome,
      })
    }
  }

  async function handleSubmitBloqueio(data: BloqueioHorarioFormData) {
    await bloqueioHorarioService.create(data)
    await reloadBloqueios()
  }

  function handleConfirmRemarcar() {
    if (!remarcarPrompt) return

    setEditingAgendamento(undefined)
    setPrefilled({
      clienteId: remarcarPrompt.clienteId,
      barbeiroId: remarcarPrompt.barbeiroId,
      servicoId: remarcarPrompt.servicoId,
      status: 'agendado',
      data: '',
      horario: '',
    })
    setFormKey(`remarcar-${Date.now()}`)
    setRemarcarPrompt(null)
    setFormOpen(true)
  }

  async function handleCancelAgendamento() {
    if (editingAgendamento) {
      await cancelAgendamento(editingAgendamento.id)
      handleCloseForm()
    }
  }

  function handleAgendamentoMove(
    agendamento: AgendamentoEnriquecido,
    barbeiroId: string,
    horario: string,
  ) {
    setPendingMove({ agendamento, barbeiroId, horario })
  }

  async function handleConfirmMove() {
    if (!pendingMove) return

    setIsMoving(true)
    try {
      await updateAgendamento(pendingMove.agendamento.id, {
        clienteId: pendingMove.agendamento.clienteId,
        barbeiroId: pendingMove.barbeiroId,
        servicoId: pendingMove.agendamento.servicoId,
        data: pendingMove.agendamento.data,
        horario: pendingMove.horario,
        duracaoMinutos: pendingMove.agendamento.duracaoMinutos,
        valorComDesconto: pendingMove.agendamento.valorComDesconto,
        status: pendingMove.agendamento.status,
      })
      setPendingMove(null)
    } finally {
      setIsMoving(false)
    }
  }

  const pendingMoveBarbeiro = pendingMove
    ? barbeiros.find((b) => b.id === pendingMove.barbeiroId)
    : undefined

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white p-3 sm:w-auto sm:min-w-[16rem] sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
          <Button
            variant="ghost"
            className="shrink-0 px-2"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            aria-label="Dia anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1 text-center sm:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <p className="text-lg font-bold leading-tight text-neutral-900 sm:text-xl">
                  {formatWeekdayLong(selectedDate)}
                </p>
                {isToday(selectedDate) && (
                  <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Hoje
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-neutral-600">
                {formatDateBR(selectedDate)}
              </p>
              <p className="text-xs text-neutral-500">
                {agendamentosAtivos.length}{' '}
                {agendamentosAtivos.length === 1 ? 'agendamento' : 'agendamentos'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="shrink-0 px-2"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            aria-label="Próximo dia"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="min-w-0 w-full sm:w-auto">
          <DatePickerField
            label="Data"
            hideLabel
            value={selectedDate}
            onChange={setSelectedDate}
            autoWidthDesktop
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setBloqueioPrefilled({
                tipo: 'pontual',
                data: selectedDate,
                horarioInicio: '09:00',
                horarioFim: '10:00',
                ...(!isDesktop && selectedBarbeiroId
                  ? { barbeiroId: selectedBarbeiroId }
                  : {}),
              })
              setBloqueioFormOpen(true)
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Novo Bloqueio
          </Button>
        </div>
      </div>

      {!isDesktop && barbeiros.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 lg:hidden">
          <Select
            label={labels.professional.one}
            value={selectedBarbeiroId}
            onChange={(e) => setSelectedBarbeiroId(e.target.value)}
            options={barbeiros.map((b) => ({
              value: b.id,
              label: `${b.nome} (${b.horarioInicio} — ${b.horarioFim})`,
            }))}
          />
          {barbeiroSelecionado && (
            <p className="mt-2 text-xs text-neutral-500">
              {labels.professional.showingAgenda(barbeiroSelecionado.nome)}
            </p>
          )}
        </div>
      )}

      {/* Legenda de status */}
      <div className="flex flex-wrap gap-3 text-xs">
        {AGENDAMENTO_STATUS.map(({ value: status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full border ${getAgendaStatusLegendColor(status)}`}
            />
            <span className="text-neutral-500">{label}</span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <AgendaGrid
          barbeiros={barbeirosVisiveis}
          agendamentos={agendamentosAtivos}
          bloqueios={bloqueios}
          servicos={servicos}
          data={selectedDate}
          intervaloSlots={intervaloSlots}
          agendaInicio={agendaInicio}
          agendaFim={agendaFim}
          onSlotClick={handleSlotClick}
          onAgendamentoClick={handleAgendamentoClick}
          onAgendamentoMove={handleAgendamentoMove}
        />
      )}

      <AgendamentoFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        onCancelAgendamento={handleCancelAgendamento}
        agendamento={editingAgendamento}
        prefilled={prefilled}
        agendamentos={todosAgendamentos}
        bloqueios={bloqueios}
        clientes={clientes}
        barbeiros={barbeiros}
        servicos={servicos}
        intervaloSlots={intervaloSlots}
        formKey={formKey}
        onCreateCliente={createCliente}
      />

      <BloqueioHorarioFormModal
        open={bloqueioFormOpen}
        onClose={handleCloseBloqueioForm}
        onSubmit={handleSubmitBloqueio}
        barbeiros={barbeiros}
        prefilled={bloqueioPrefilled}
      />

      <NovoItemAgendaDialog
        open={!!novoItemPrompt}
        onClose={() => setNovoItemPrompt(null)}
        onSelectAgendamento={openAgendamentoFromPrompt}
        onSelectBloqueio={openBloqueioFromPrompt}
      />

      <ConfirmDialog
        open={!!remarcarPrompt}
        onClose={() => setRemarcarPrompt(null)}
        onConfirm={handleConfirmRemarcar}
        title="Remarcar cliente"
        description={
          remarcarPrompt
            ? `Deseja remarcar ${remarcarPrompt.clienteNome}? Você poderá escolher uma nova data e horário.`
            : ''
        }
        confirmLabel="Sim, remarcar"
        cancelLabel="Não"
        confirmVariant="primary"
      />

      <AgendamentoMoveModal
        open={!!pendingMove}
        agendamento={pendingMove?.agendamento ?? null}
        barbeiroNome={pendingMoveBarbeiro?.nome ?? ''}
        novoHorario={pendingMove?.horario ?? ''}
        isLoading={isMoving}
        onClose={() => setPendingMove(null)}
        onConfirm={handleConfirmMove}
      />
    </div>
  )
}
