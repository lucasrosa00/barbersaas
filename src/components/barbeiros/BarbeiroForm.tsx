import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DIAS_SEMANA, type DiaSemana } from '@/constants/diasSemana'
import { labels } from '@/constants/terminology'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TimePickerField } from '@/components/ui/TimePickerField'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

const diaSemanaValues = DIAS_SEMANA.map((d) => d.value) as [
  DiaSemana,
  ...DiaSemana[],
]

const barbeiroSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    especialidadesInput: z.string().min(1, labels.specialties.required),
    diasTrabalho: z
      .array(z.enum(diaSemanaValues))
      .min(1, 'Selecione ao menos um dia'),
    horarioInicio: z.string().min(1, 'Horário de início é obrigatório'),
    horarioFim: z.string().min(1, 'Horário de fim é obrigatório'),
    ordemExibicao: z.coerce.number().int().min(1, 'Informe uma ordem válida'),
  })
  .refine((data) => data.horarioFim > data.horarioInicio, {
    message: 'Horário de fim deve ser posterior ao início',
    path: ['horarioFim'],
  })

type BarbeiroFormValues = z.infer<typeof barbeiroSchema>

interface BarbeiroFormProps {
  defaultValues?: Barbeiro
  totalBarbeiros: number
  onSubmit: (data: BarbeiroFormData) => void
  onCancel: () => void
  submitLabel?: string
}

function toFormValues(
  barbeiro: Barbeiro | undefined,
  totalBarbeiros: number,
  isEditing: boolean,
): BarbeiroFormValues {
  const maxOrder = isEditing ? totalBarbeiros : totalBarbeiros + 1
  const defaultOrder = isEditing
    ? (barbeiro?.ordemExibicao ?? 1)
    : Math.max(1, maxOrder)

  return {
    nome: barbeiro?.nome ?? '',
    telefone: barbeiro?.telefone ?? '',
    especialidadesInput: barbeiro?.especialidades.join(', ') ?? '',
    diasTrabalho: barbeiro?.diasTrabalho ?? [],
    horarioInicio: barbeiro?.horarioInicio ?? '09:00',
    horarioFim: barbeiro?.horarioFim ?? '18:00',
    ordemExibicao: defaultOrder,
  }
}

function toBarbeiroFormData(values: BarbeiroFormValues): BarbeiroFormData {
  return {
    nome: values.nome,
    telefone: values.telefone,
    especialidades: values.especialidadesInput
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
    diasTrabalho: values.diasTrabalho,
    horarioInicio: values.horarioInicio,
    horarioFim: values.horarioFim,
    ordemExibicao: values.ordemExibicao,
  }
}

export function BarbeiroForm({
  defaultValues,
  totalBarbeiros,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
}: BarbeiroFormProps) {
  const isEditing = !!defaultValues
  const maxOrder = isEditing ? totalBarbeiros : totalBarbeiros + 1
  const ordemOptions = Array.from({ length: Math.max(1, maxOrder) }, (_, i) => {
    const value = String(i + 1)
    return { value, label: `${i + 1}ª posição` }
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BarbeiroFormValues>({
    resolver: zodResolver(barbeiroSchema),
    defaultValues: toFormValues(defaultValues, totalBarbeiros, isEditing),
  })

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(toBarbeiroFormData(values)))}
      className="space-y-4"
    >
      <Input
        label="Nome"
        placeholder="Nome completo"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <Input
        label="Telefone"
        placeholder="(00) 00000-0000"
        error={errors.telefone?.message}
        {...register('telefone')}
      />

      <Select
        label="Ordem de exibição (Agenda)"
        options={ordemOptions}
        error={errors.ordemExibicao?.message}
        {...register('ordemExibicao')}
      />
      <p className="-mt-2 text-xs text-neutral-500">
        Define a posição do profissional nas colunas da agenda. Ao alterar, os
        demais são reordenados automaticamente.
      </p>

      <Input
        label={labels.specialties.label}
        placeholder={labels.specialties.placeholder}
        error={errors.especialidadesInput?.message}
        {...register('especialidadesInput')}
      />
      <p className="-mt-2 text-xs text-neutral-500">
        {labels.specialties.hint}
      </p>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-neutral-600">
          Dias de trabalho
        </span>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map(({ value, label }) => (
            <Controller
              key={value}
              name="diasTrabalho"
              control={control}
              render={({ field }) => {
                const checked = field.value.includes(value)

                return (
                  <label
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      checked
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900'
                        : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, value])
                        } else {
                          field.onChange(
                            field.value.filter((d) => d !== value),
                          )
                        }
                      }}
                    />
                    {label}
                  </label>
                )
              }}
            />
          ))}
        </div>
        {errors.diasTrabalho && (
          <p className="text-xs text-neutral-600">{errors.diasTrabalho.message}</p>
        )}
      </div>

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
            />
          )}
        />
      </div>

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
