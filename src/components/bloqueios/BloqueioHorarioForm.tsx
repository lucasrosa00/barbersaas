import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DIAS_SEMANA, type DiaSemana } from '@/constants/diasSemana'
import { TIPOS_BLOQUEIO } from '@/constants/tipoBloqueio'
import { labels } from '@/constants/terminology'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { DatePickerField } from '@/components/ui/DatePickerField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TimePickerField } from '@/components/ui/TimePickerField'
import { AGENDA_BOOKING_STEP_MINUTES } from '@/utils/agenda'
import type { Barbeiro } from '@/types/barbeiro'
import type { BloqueioHorario, BloqueioHorarioFormData } from '@/types/bloqueioHorario'

const diaSemanaValues = DIAS_SEMANA.map((d) => d.value) as [
  DiaSemana,
  ...DiaSemana[],
]

const tipoValues = TIPOS_BLOQUEIO.map((t) => t.value) as [
  BloqueioHorarioFormData['tipo'],
  ...BloqueioHorarioFormData['tipo'][],
]

const bloqueioSchema = z
  .object({
    barbeiroId: z.string().min(1, labels.professional.selectRequired),
    tipo: z.enum(tipoValues),
    dia: z.enum(diaSemanaValues).optional(),
    data: z.string().optional(),
    horarioInicio: z.string().min(1, 'Horário de início é obrigatório'),
    horarioFim: z.string().min(1, 'Horário de fim é obrigatório'),
    motivo: z.string().min(1, 'Informe o motivo do bloqueio').max(300),
  })
  .refine((data) => data.horarioFim > data.horarioInicio, {
    message: 'Horário de fim deve ser posterior ao início',
    path: ['horarioFim'],
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'fixo' && !data.dia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o dia da semana',
        path: ['dia'],
      })
    }
    if (data.tipo === 'pontual' && !data.data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione a data',
        path: ['data'],
      })
    }
  })

type BloqueioFormValues = z.infer<typeof bloqueioSchema>

interface BloqueioHorarioFormProps {
  barbeiros: Barbeiro[]
  defaultValues?: BloqueioHorario
  prefilled?: Partial<BloqueioHorarioFormData>
  onSubmit: (data: BloqueioHorarioFormData) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
}

function toFormValues(
  bloqueio?: BloqueioHorario,
  prefilled?: Partial<BloqueioHorarioFormData>,
): BloqueioFormValues {
  const base: BloqueioFormValues = {
    barbeiroId: bloqueio?.barbeiroId ?? '',
    tipo: bloqueio?.tipo ?? 'fixo',
    dia: bloqueio?.dia,
    data: bloqueio?.data ?? '',
    horarioInicio: bloqueio?.horarioInicio ?? '12:00',
    horarioFim: bloqueio?.horarioFim ?? '13:00',
    motivo: bloqueio?.motivo ?? '',
  }

  if (!prefilled) return base

  return {
    ...base,
    ...prefilled,
    // Normaliza campos opcionais de acordo com o tipo
    dia: prefilled.tipo === 'fixo' ? prefilled.dia ?? base.dia : base.dia,
    data: prefilled.tipo === 'pontual' ? prefilled.data ?? base.data : base.data,
  }
}

function toFormData(values: BloqueioFormValues): BloqueioHorarioFormData {
  return {
    barbeiroId: values.barbeiroId,
    tipo: values.tipo,
    dia: values.tipo === 'fixo' ? values.dia : undefined,
    data: values.tipo === 'pontual' ? values.data : undefined,
    horarioInicio: values.horarioInicio,
    horarioFim: values.horarioFim,
    motivo: values.motivo,
  }
}

export function BloqueioHorarioForm({
  barbeiros,
  defaultValues,
  prefilled,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
}: BloqueioHorarioFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BloqueioFormValues>({
    resolver: zodResolver(bloqueioSchema),
    defaultValues: toFormValues(defaultValues, prefilled),
  })

  const tipo = useWatch({ control, name: 'tipo' })
  const tipoInfo = TIPOS_BLOQUEIO.find((t) => t.value === tipo)

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(toFormData(values)))}
      className="space-y-4"
    >
      <Select
        label="Tipo de bloqueio"
        options={TIPOS_BLOQUEIO.map((t) => ({
          value: t.value,
          label: t.label,
        }))}
        error={errors.tipo?.message}
        {...register('tipo')}
      />
      {tipoInfo && (
        <p className="-mt-2 text-xs text-neutral-500">{tipoInfo.description}</p>
      )}

      <Select
        label={labels.professional.one}
        placeholder={labels.professional.select}
        options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
        error={errors.barbeiroId?.message}
        {...register('barbeiroId')}
      />

      {tipo === 'fixo' ? (
        <Select
          label="Dia da semana"
          placeholder="Selecione o dia"
          options={DIAS_SEMANA.map((d) => ({
            value: d.value,
            label: d.label,
          }))}
          error={errors.dia?.message}
          {...register('dia')}
        />
      ) : (
        <Controller
          name="data"
          control={control}
          render={({ field }) => (
            <DatePickerField
              label="Data"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.data?.message}
            />
          )}
        />
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="horarioInicio"
          control={control}
          render={({ field }) => (
            <TimePickerField
              label="Horário início"
              value={field.value}
              onChange={field.onChange}
              error={errors.horarioInicio?.message}
              intervalMinutes={AGENDA_BOOKING_STEP_MINUTES}
            />
          )}
        />
        <Controller
          name="horarioFim"
          control={control}
          render={({ field }) => (
            <TimePickerField
              label="Horário fim"
              value={field.value}
              onChange={field.onChange}
              error={errors.horarioFim?.message}
              intervalMinutes={AGENDA_BOOKING_STEP_MINUTES}
            />
          )}
        />
      </div>

      <Input
        label="Motivo"
        placeholder="Ex.: Almoço, consulta médica, reunião..."
        error={errors.motivo?.message}
        {...register('motivo')}
      />

      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}
