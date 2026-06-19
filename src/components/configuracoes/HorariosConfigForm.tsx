import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { TimePickerField } from '@/components/ui/TimePickerField'
import { Select } from '@/components/ui/Select'
import type { EmpresaConfig } from '@/types/empresaConfig'

const schema = z
  .object({
    horarioAbertura: z.string().min(1, 'Horário de abertura é obrigatório'),
    horarioFechamento: z.string().min(1, 'Horário de fechamento é obrigatório'),
    intervaloSlots: z.coerce.number().refine(
      (v) => [15, 30, 60].includes(v),
      'Intervalo inválido',
    ),
  })
  .refine((data) => data.horarioFechamento > data.horarioAbertura, {
    message: 'Fechamento deve ser posterior à abertura',
    path: ['horarioFechamento'],
  })

type HorariosForm = z.infer<typeof schema>

interface HorariosConfigFormProps {
  config: EmpresaConfig
  isSaving?: boolean
  onSubmit: (data: HorariosForm) => void | Promise<void>
}

export function HorariosConfigForm({
  config,
  isSaving = false,
  onSubmit,
}: HorariosConfigFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HorariosForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      horarioAbertura: config.horarioAbertura,
      horarioFechamento: config.horarioFechamento,
      intervaloSlots: config.intervaloSlots,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="horarioAbertura"
          control={control}
          render={({ field }) => (
            <TimePickerField
              label="Abertura"
              value={field.value}
              onChange={field.onChange}
              error={errors.horarioAbertura?.message}
            />
          )}
        />
        <Controller
          name="horarioFechamento"
          control={control}
          render={({ field }) => (
            <TimePickerField
              label="Fechamento"
              value={field.value}
              onChange={field.onChange}
              error={errors.horarioFechamento?.message}
            />
          )}
        />
      </div>

      <Select
        label="Intervalo entre horários"
        options={[
          { value: '15', label: '15 minutos' },
          { value: '30', label: '30 minutos' },
          { value: '60', label: '60 minutos' },
        ]}
        error={errors.intervaloSlots?.message}
        {...register('intervaloSlots')}
      />

      <p className="text-xs text-neutral-500">
        Define a grade base da agenda. Horários logo após o fim de cada serviço
        também ficam disponíveis para encaixe.
      </p>

      <div className="flex justify-stretch sm:justify-end">
        <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
          Salvar horários
        </Button>
      </div>
    </form>
  )
}

export type { HorariosForm }
