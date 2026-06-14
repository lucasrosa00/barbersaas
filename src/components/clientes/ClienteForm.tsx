import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { Cliente, ClienteFormData } from '@/types/cliente'

const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  observacoes: z.string(),
})

interface ClienteFormProps {
  defaultValues?: Cliente
  onSubmit: (data: ClienteFormData) => void
  onCancel: () => void
  submitLabel?: string
}

export function ClienteForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      telefone: defaultValues?.telefone ?? '',
      observacoes: defaultValues?.observacoes ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <Textarea
        label="Observações"
        placeholder="Informações adicionais sobre o cliente"
        error={errors.observacoes?.message}
        {...register('observacoes')}
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
