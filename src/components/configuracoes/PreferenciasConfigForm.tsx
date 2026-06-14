import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import type { EmpresaConfig } from '@/types/empresaConfig'

interface PreferenciasForm {
  confirmacaoManual: boolean
  permitirMesmoDia: boolean
}

interface PreferenciasConfigFormProps {
  config: EmpresaConfig
  isSaving?: boolean
  onSubmit: (data: PreferenciasForm) => void | Promise<void>
}

export function PreferenciasConfigForm({
  config,
  isSaving = false,
  onSubmit,
}: PreferenciasConfigFormProps) {
  const { register, handleSubmit } = useForm<PreferenciasForm>({
    defaultValues: {
      confirmacaoManual: config.confirmacaoManual,
      permitirMesmoDia: config.permitirMesmoDia,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-400 bg-white text-neutral-900 focus:ring-neutral-400"
          {...register('confirmacaoManual')}
        />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Exigir confirmação manual
          </p>
          <p className="text-xs text-neutral-500">
            Novos agendamentos ficam como &quot;Agendado&quot; até confirmação.
          </p>
        </div>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-400 bg-white text-neutral-900 focus:ring-neutral-400"
          {...register('permitirMesmoDia')}
        />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Permitir agendamento no mesmo dia
          </p>
          <p className="text-xs text-neutral-500">
            Clientes podem agendar para o dia atual.
          </p>
        </div>
      </label>

      <div className="flex justify-stretch sm:justify-end">
        <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
          Salvar preferências
        </Button>
      </div>
    </form>
  )
}

export type { PreferenciasForm }
