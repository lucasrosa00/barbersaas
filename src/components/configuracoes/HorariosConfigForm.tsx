import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Abertura"
          type="time"
          error={errors.horarioAbertura?.message}
          {...register('horarioAbertura')}
        />
        <Input
          label="Fechamento"
          type="time"
          error={errors.horarioFechamento?.message}
          {...register('horarioFechamento')}
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
        Essas configurações serão aplicadas na agenda quando integradas ao
        backend.
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
