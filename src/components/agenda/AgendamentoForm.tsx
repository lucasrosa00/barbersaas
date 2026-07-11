import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle, Plus } from 'lucide-react'
import { labels } from '@/constants/terminology'
import { AGENDAMENTO_STATUS } from '@/constants/agendamentoStatus'
import { METODOS_PAGAMENTO } from '@/constants/metodoPagamento'
import { ClienteFormModal } from '@/components/clientes/ClienteFormModal'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { Input } from '@/components/ui/Input'
import { Combobox } from '@/components/ui/Combobox'
import { Select } from '@/components/ui/Select'
import type { AgendamentoEnriquecido, AgendamentoFormData } from '@/types/agendamento'
import type { BloqueioHorario } from '@/types/bloqueioHorario'
import type { Cliente, ClienteFormData } from '@/types/cliente'
import type { Barbeiro } from '@/types/barbeiro'
import type { Servico } from '@/types/servico'
import type { IntervaloSlot } from '@/types/empresaConfig'
import {
  AGENDA_BOOKING_STEP_MINUTES,
  formatHorarioIntervalo,
  getHorariosDisponiveis,
  hasConflict,
} from '@/utils/agenda'
import { useAuth } from '@/hooks/useAuth'
import { useBloqueiosPorData } from '@/hooks/useBloqueiosHorario'
import { buildAgendamentoConfirmacaoWhatsAppUrl } from '@/utils/whatsapp'
import { formatCurrency } from '@/utils/formatCurrency'
import {
  getServicosSelecionados,
  joinServicosNomes,
  sumServicosDuracao,
  sumServicosValor,
} from '@/utils/agendamentoServicos'

const metodoPagamentoValues = METODOS_PAGAMENTO.map((m) => m.value) as [
  NonNullable<AgendamentoFormData['metodoPagamento']>,
  ...NonNullable<AgendamentoFormData['metodoPagamento']>[],
]

const statusValues = AGENDAMENTO_STATUS.map((s) => s.value) as [
  AgendamentoFormData['status'],
  ...AgendamentoFormData['status'][],
]

interface AgendamentoFormProps {
  defaultValues?: Partial<AgendamentoEnriquecido>
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  servicos: Servico[]
  agendamentos: AgendamentoEnriquecido[]
  bloqueios?: BloqueioHorario[]
  intervaloSlots: IntervaloSlot
  editingId?: string
  onSubmit: (data: AgendamentoFormData) => void | Promise<void>
  onCancel: () => void
  onCancelAgendamento?: () => void
  onCreateCliente?: (data: ClienteFormData) => Promise<Cliente>
  submitLabel?: string
  isEditing?: boolean
  empresaNome?: string
  enviarLinkConfirmacaoWhatsApp?: boolean
  mensagemConfirmacaoWhatsApp?: string | null
}

export function AgendamentoForm({
  defaultValues,
  clientes,
  barbeiros,
  servicos,
  agendamentos,
  bloqueios = [],
  intervaloSlots,
  editingId,
  onSubmit,
  onCancel,
  onCancelAgendamento,
  onCreateCliente,
  submitLabel = 'Salvar',
  isEditing = false,
  empresaNome,
  enviarLinkConfirmacaoWhatsApp = false,
  mensagemConfirmacaoWhatsApp = null,
}: AgendamentoFormProps) {
  const { user } = useAuth()
  const [clienteFormOpen, setClienteFormOpen] = useState(false)

  const agendamentoSchema = useMemo(
    () =>
      z
        .object({
          clienteId: z.string().min(1, 'Selecione um cliente'),
          barbeiroId: z.string().min(1, labels.professional.selectRequired),
          servicoIds: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
          data: z.string().min(1, 'Data é obrigatória'),
          horario: z.string().min(1, 'Horário é obrigatório'),
          duracaoMinutos: z.coerce
            .number()
            .int('Duração deve ser um número inteiro')
            .min(5, 'Duração mínima de 5 minutos'),
          valorComDesconto: z.preprocess(
            (value) => {
              if (value === '' || value === undefined || value === null) return undefined
              const parsed = Number(value)
              return Number.isNaN(parsed) ? value : parsed
            },
            z.number().min(0, 'Valor não pode ser negativo').optional(),
          ),
          status: z.enum(statusValues),
          metodoPagamento: z.enum(metodoPagamentoValues).optional(),
        })
        .superRefine((data, ctx) => {
          if (data.status === 'finalizado' && !data.metodoPagamento) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Selecione o método de pagamento',
              path: ['metodoPagamento'],
            })
          }
        })
        .superRefine((data, ctx) => {
          const barbeiro = barbeiros.find((b) => b.id === data.barbeiroId)
          if (!barbeiro) return

          if (
            hasConflict(
              agendamentos,
              data.data,
              data.barbeiroId,
              data.horario,
              data.duracaoMinutos,
              editingId,
            )
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Horário indisponível — conflito com outro agendamento',
              path: ['horario'],
            })
          }
        }),
    [agendamentos, barbeiros, editingId],
  )

  const servicosIniciais = getServicosSelecionados(
    servicos,
    defaultValues?.servicoIds ?? [],
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema) as Resolver<AgendamentoFormData>,
    defaultValues: {
      clienteId: defaultValues?.clienteId ?? '',
      barbeiroId: defaultValues?.barbeiroId ?? '',
      servicoIds: defaultValues?.servicoIds ?? [],
      data:
        defaultValues?.data !== undefined
          ? defaultValues.data
          : new Date().toISOString().split('T')[0],
      horario: defaultValues?.horario ?? '',
      duracaoMinutos:
        defaultValues?.duracaoMinutos ??
        (servicosIniciais.length > 0
          ? sumServicosDuracao(servicosIniciais)
          : 30),
      valorComDesconto: defaultValues?.valorComDesconto ?? undefined,
      status: defaultValues?.status ?? 'agendado',
      metodoPagamento: defaultValues?.metodoPagamento,
    },
  })

  const barbeiroId = watch('barbeiroId')
  const servicoIds = watch('servicoIds')
  const clienteId = watch('clienteId')
  const horario = watch('horario')
  const dataSelecionada = watch('data')
  const status = watch('status')
  const metodoPagamento = watch('metodoPagamento')
  const duracaoMinutos = watch('duracaoMinutos')
  const valorComDesconto = watch('valorComDesconto')

  const { bloqueios: bloqueiosDaData } = useBloqueiosPorData(
    user?.empresaId ?? '',
    dataSelecionada,
  )
  const bloqueiosAtivos = bloqueiosDaData.length > 0 ? bloqueiosDaData : bloqueios

  const clienteSelecionado = clientes.find((c) => c.id === clienteId)
  const barbeiroSelecionado = barbeiros.find((b) => b.id === barbeiroId)
  const servicosSelecionados = getServicosSelecionados(servicos, servicoIds)

  const servicosFiltrados = servicos.filter(
    (s) => !barbeiroId || s.barbeirosDisponiveis.includes(barbeiroId),
  )

  const previousServicoIds = useRef<string[]>(servicoIds)

  useEffect(() => {
    if (servicosSelecionados.length === 0) return

    const previousKey = previousServicoIds.current.join('|')
    const currentKey = servicoIds.join('|')
    if (currentKey === previousKey) return

    setValue('duracaoMinutos', sumServicosDuracao(servicosSelecionados))
    setValue('valorComDesconto', undefined)
    previousServicoIds.current = servicoIds
  }, [servicoIds, servicosSelecionados, setValue])

  const horariosDisponiveis = useMemo(() => {
    if (!barbeiroSelecionado || servicosSelecionados.length === 0 || !dataSelecionada) return []
    if (!duracaoMinutos || duracaoMinutos < 5) return []

    return getHorariosDisponiveis(
      barbeiroSelecionado,
      agendamentos,
      duracaoMinutos,
      dataSelecionada,
      intervaloSlots,
      editingId,
      horario,
      bloqueiosAtivos,
    )
  }, [
    barbeiroSelecionado,
    servicosSelecionados,
    dataSelecionada,
    duracaoMinutos,
    agendamentos,
    bloqueiosAtivos,
    intervaloSlots,
    editingId,
    horario,
  ])

  useEffect(() => {
    const validIds = servicoIds.filter((id) =>
      servicosFiltrados.some((servico) => servico.id === id),
    )

    if (validIds.length !== servicoIds.length) {
      setValue('servicoIds', validIds)
    }
  }, [barbeiroId, servicosFiltrados, servicoIds, setValue])

  useEffect(() => {
    if (!horario || horariosDisponiveis.length === 0) return
    if (!horariosDisponiveis.includes(horario)) {
      setValue('horario', horariosDisponiveis[0])
    }
  }, [horariosDisponiveis, horario, setValue])

  useEffect(() => {
    if (status !== 'finalizado' && metodoPagamento) {
      setValue('metodoPagamento', undefined)
    }
  }, [status, metodoPagamento, setValue])

  const canCancel =
    isEditing &&
    onCancelAgendamento &&
    status !== 'cancelado' &&
    status !== 'finalizado'

  const intervaloPreview =
    horario && duracaoMinutos >= 5
      ? formatHorarioIntervalo(horario, duracaoMinutos)
      : null

  const duracaoPadraoServicos =
    servicosSelecionados.length > 0
      ? sumServicosDuracao(servicosSelecionados)
      : undefined
  const valorPadraoServicos =
    servicosSelecionados.length > 0 ? sumServicosValor(servicosSelecionados) : undefined
  const duracaoPersonalizada =
    duracaoPadraoServicos !== undefined && duracaoMinutos !== duracaoPadraoServicos

  const valorCobrado =
    valorComDesconto !== undefined &&
    valorComDesconto !== null &&
    !Number.isNaN(Number(valorComDesconto))
      ? Number(valorComDesconto)
      : valorPadraoServicos

  const whatsappConfirmacaoUrl = useMemo(() => {
    if (!isEditing || !clienteSelecionado?.telefone || !horario || !dataSelecionada) {
      return null
    }

    const servicoNome =
      servicosSelecionados.length > 0
        ? joinServicosNomes(servicosSelecionados)
        : defaultValues?.servicoNome
    const barbeiroNome = barbeiroSelecionado?.nome ?? defaultValues?.barbeiroNome

    if (!servicoNome || !barbeiroNome || !duracaoMinutos) return null

    return buildAgendamentoConfirmacaoWhatsAppUrl(clienteSelecionado.telefone, {
      clienteNome: clienteSelecionado.nome,
      data: dataSelecionada,
      horario,
      duracaoMinutos,
      servicoNome,
      barbeiroNome,
      empresaNome,
      tokenConfirmacao: defaultValues?.tokenConfirmacao,
      enviarLinkConfirmacao: enviarLinkConfirmacaoWhatsApp,
      mensagemConfirmacaoWhatsApp,
    })
  }, [
    isEditing,
    clienteSelecionado,
    horario,
    dataSelecionada,
    duracaoMinutos,
    servicosSelecionados,
    barbeiroSelecionado,
    defaultValues?.servicoNome,
    defaultValues?.barbeiroNome,
    defaultValues?.tokenConfirmacao,
    empresaNome,
    enviarLinkConfirmacaoWhatsApp,
    mensagemConfirmacaoWhatsApp,
  ])

  const clienteOptions = useMemo(
    () => clientes.map((c) => ({ value: c.id, label: c.nome })),
    [clientes],
  )

  async function handleCreateCliente(data: ClienteFormData) {
    if (!onCreateCliente) return
    const novo = await onCreateCliente(data)
    setValue('clienteId', novo.id)
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 space-y-4">
      <div className="space-y-2">
        <Controller
          name="clienteId"
          control={control}
          render={({ field }) => (
            <Combobox
              label="Cliente"
              placeholder="Digite o nome do cliente"
              options={clienteOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.clienteId?.message}
              labelAction={
                onCreateCliente ? (
                  <button
                    type="button"
                    onClick={() => setClienteFormOpen(true)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                    aria-label="Cadastrar novo cliente"
                    title="Cadastrar novo cliente"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                ) : undefined
              }
            />
          )}
        />

        {isEditing && clienteSelecionado && (
          <div className="space-y-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm">
            <p className="text-neutral-700">
              <span className="font-medium text-neutral-500">Telefone: </span>
              <a
                href={`tel:${clienteSelecionado.telefone.replace(/\D/g, '')}`}
                className="text-neutral-900 hover:underline"
              >
                {clienteSelecionado.telefone}
              </a>
            </p>
            {clienteSelecionado.observacoes ? (
              <p className="text-neutral-700">
                <span className="font-medium text-neutral-500">Observações: </span>
                {clienteSelecionado.observacoes}
              </p>
            ) : (
              <p className="text-neutral-400">Sem observações cadastradas</p>
            )}

            {whatsappConfirmacaoUrl && (
              <a
                href={whatsappConfirmacaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#20bd5a] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Enviar confirmação no WhatsApp
              </a>
            )}
          </div>
        )}
      </div>

      <Select
        label={labels.professional.one}
        placeholder={labels.professional.select}
        options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
        error={errors.barbeiroId?.message}
        {...register('barbeiroId')}
      />

      <Controller
        name="servicoIds"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-600">Serviços</span>
            {!barbeiroId ? (
              <p className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-500">
                {labels.professional.select} para ver os serviços disponíveis
              </p>
            ) : servicosFiltrados.length === 0 ? (
              <p className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-500">
                Nenhum serviço disponível para este profissional
              </p>
            ) : (
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-neutral-300 bg-white p-3">
                {servicosFiltrados.map((servico) => {
                  const checked = field.value.includes(servico.id)

                  return (
                    <label
                      key={servico.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-1 hover:bg-neutral-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const next = event.target.checked
                            ? [...field.value, servico.id]
                            : field.value.filter((id) => id !== servico.id)
                          field.onChange(next)
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900"
                      />
                      <span className="text-sm text-neutral-800">
                        {servico.nome} ({servico.duracaoMinutos} min ·{' '}
                        {formatCurrency(servico.valor)})
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
            {errors.servicoIds?.message && (
              <p className="text-xs text-red-600">{errors.servicoIds.message}</p>
            )}
          </div>
        )}
      />

      {servicosSelecionados.length > 0 && (
        <div className="space-y-1.5">
          <Input
            label="Duração do atendimento (min)"
            type="number"
            min={5}
            step={AGENDA_BOOKING_STEP_MINUTES}
            error={errors.duracaoMinutos?.message}
            {...register('duracaoMinutos', { valueAsNumber: true })}
          />
          <p className="text-xs text-neutral-500">
            {duracaoPersonalizada
              ? `Padrão dos serviços: ${duracaoPadraoServicos} min`
              : 'Soma das durações dos serviços; altere se necessário para este cliente'}
          </p>
        </div>
      )}

      {servicosSelecionados.length > 0 && valorPadraoServicos !== undefined && (
        <div className="space-y-1.5">
          <Input
            label="Valor com desconto (opcional)"
            type="number"
            min={0}
            step={0.01}
            placeholder={formatCurrency(valorPadraoServicos)}
            error={errors.valorComDesconto?.message}
            {...register('valorComDesconto')}
          />
          <p className="text-xs text-neutral-500">
            Soma dos serviços: {formatCurrency(valorPadraoServicos)} — deixe vazio para
            usar o valor total ou informe 0 se não houve cobrança
          </p>
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="data"
          control={control}
          render={({ field }) => (
            <DatePickerField
              label="Data"
              value={field.value}
              onChange={field.onChange}
              error={errors.data?.message}
            />
          )}
        />

        {barbeiroSelecionado && servicosSelecionados.length > 0 && duracaoMinutos >= 5 ? (
          <Select
            label="Horário de início"
            options={horariosDisponiveis.map((h) => ({
              value: h,
              label: formatHorarioIntervalo(h, duracaoMinutos),
            }))}
            error={errors.horario?.message}
            {...register('horario')}
          />
        ) : (
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-600">
              Horário de início
            </span>
            <p className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-500">
              {labels.professional.selectWithService}
            </p>
          </div>
        )}
      </div>

      {intervaloPreview && (
        <p className="text-xs text-neutral-900">
          Duração: {duracaoMinutos} min
          {duracaoPersonalizada && duracaoPadraoServicos !== undefined
            ? ` (padrão: ${duracaoPadraoServicos} min)`
            : ''}{' '}
          · Intervalo {intervaloPreview}
          {valorCobrado !== undefined && (
            <>
              {' '}
              · Valor: {formatCurrency(valorCobrado)}
              {valorComDesconto !== undefined &&
                valorComDesconto !== null &&
                valorPadraoServicos !== undefined &&
                Number(valorComDesconto) !== valorPadraoServicos && (
                  <span className="text-neutral-500">
                    {' '}
                    (padrão: {formatCurrency(valorPadraoServicos)})
                  </span>
                )}
            </>
          )}
        </p>
      )}

      {barbeiroSelecionado &&
        servicosSelecionados.length > 0 &&
        duracaoMinutos >= 5 &&
        horariosDisponiveis.length === 0 && (
          <p className="text-xs text-neutral-700">
            {labels.professional.noSlots}
          </p>
        )}

      {isEditing && (
        <Select
          label="Status"
          options={AGENDAMENTO_STATUS.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
          error={errors.status?.message}
          {...register('status')}
        />
      )}

      {isEditing && status === 'finalizado' && (
        <Select
          label="Método de pagamento"
          placeholder="Selecione o método de pagamento"
          options={METODOS_PAGAMENTO.map((m) => ({
            value: m.value,
            label: m.label,
          }))}
          error={errors.metodoPagamento?.message}
          {...register('metodoPagamento')}
        />
      )}

      <FormActions align="between">
        <div className="w-full sm:w-auto">
          {canCancel && (
            <Button
              type="button"
              variant="danger"
              onClick={onCancelAgendamento}
              className="w-full sm:w-auto"
            >
              Cancelar agendamento
            </Button>
          )}
        </div>

        <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
            Fechar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={
              !barbeiroSelecionado ||
              servicosSelecionados.length === 0 ||
              duracaoMinutos < 5 ||
              horariosDisponiveis.length === 0
            }
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>
        </div>
      </FormActions>
    </form>

    {onCreateCliente && (
      <ClienteFormModal
        open={clienteFormOpen}
        onClose={() => setClienteFormOpen(false)}
        onSubmit={handleCreateCliente}
        nested
      />
    )}
    </>
  )
}
