import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { EmpresaConfig } from '@/types/empresaConfig'

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  logo: z.string().url('URL inválida'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
})

type DadosForm = z.infer<typeof schema>

interface EmpresaDadosFormProps {
  config: EmpresaConfig
  disabled?: boolean
  isSaving?: boolean
  onSubmit: (data: DadosForm) => void | Promise<void>
}

export function EmpresaDadosForm({
  config,
  disabled = false,
  isSaving = false,
  onSubmit,
}: EmpresaDadosFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: config.nome,
      logo: config.logo,
      telefone: config.telefone,
      endereco: config.endereco,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <img
          src={config.logo}
          alt={config.nome}
          className="h-16 w-16 rounded-xl border border-neutral-300 bg-neutral-100"
        />
        <p className="text-xs text-neutral-500">
          A logo é atualizada ao salvar a URL abaixo.
        </p>
      </div>

      <Input
        label="Nome da empresa"
        disabled={disabled}
        error={errors.nome?.message}
        {...register('nome')}
      />

      <Input
        label="URL da logo"
        disabled={disabled}
        error={errors.logo?.message}
        {...register('logo')}
      />

      <Input
        label="Telefone"
        placeholder="(00) 0000-0000"
        disabled={disabled}
        error={errors.telefone?.message}
        {...register('telefone')}
      />

      <Input
        label="Endereço"
        disabled={disabled}
        error={errors.endereco?.message}
        {...register('endereco')}
      />

      {!disabled && (
        <div className="flex justify-stretch sm:justify-end">
          <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
            Salvar dados
          </Button>
        </div>
      )}
    </form>
  )
}

export type { DadosForm }
