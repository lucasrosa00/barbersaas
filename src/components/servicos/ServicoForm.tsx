import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { labels } from '@/constants/terminology'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { Input } from '@/components/ui/Input'
import type { Servico, ServicoFormData } from '@/types/servico'

const servicoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  duracaoMinutos: z.coerce
    .number()
    .int('Duração deve ser um número inteiro')
    .min(5, 'Duração mínima de 5 minutos'),
  barbeirosDisponiveis: z
    .array(z.string())
    .min(1, labels.professional.selectAtLeastOne),
})

interface BarbeiroOption {
  id: string
  nome: string
}

interface ServicoFormProps {
  defaultValues?: Servico
  barbeiros: BarbeiroOption[]
  onSubmit: (data: ServicoFormData) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function ServicoForm({
  defaultValues,
  barbeiros,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
}: ServicoFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicoFormData>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      valor: defaultValues?.valor ?? 0,
      duracaoMinutos: defaultValues?.duracaoMinutos ?? 30,
      barbeirosDisponiveis: defaultValues?.barbeirosDisponiveis ?? [],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        placeholder={labels.service.namePlaceholder}
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          error={errors.valor?.message}
          {...register('valor')}
        />
        <Input
          label="Duração (minutos)"
          type="number"
          min="5"
          step="5"
          placeholder="30"
          error={errors.duracaoMinutos?.message}
          {...register('duracaoMinutos')}
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-neutral-600">
          {labels.professional.available}
        </span>

        {barbeiros.length === 0 ? (
          <p className="text-sm text-neutral-500">
            {labels.professional.noneRegisteredInCompany}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {barbeiros.map(({ id, nome }) => (
              <Controller
                key={id}
                name="barbeirosDisponiveis"
                control={control}
                render={({ field }) => {
                  const checked = field.value.includes(id)

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
                            field.onChange([...field.value, id])
                          } else {
                            field.onChange(field.value.filter((b) => b !== id))
                          }
                        }}
                      />
                      {nome}
                    </label>
                  )
                }}
              />
            ))}
          </div>
        )}

        {errors.barbeirosDisponiveis && (
          <p className="text-xs text-neutral-600">
            {errors.barbeirosDisponiveis.message}
          </p>
        )}
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
