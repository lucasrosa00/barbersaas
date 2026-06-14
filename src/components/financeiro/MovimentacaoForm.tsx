import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { MovimentacaoFormData, TipoMovimentacao } from '@/types/financeiro'

const tipoValues = ['entrada', 'saida'] as [TipoMovimentacao, ...TipoMovimentacao[]]

const movimentacaoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  data: z.string().min(1, 'Data é obrigatória'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  tipo: z.enum(tipoValues),
  barbeiroId: z.string().optional(),
})

interface BarbeiroOption {
  id: string
  nome: string
}

interface MovimentacaoFormProps {
  barbeiros: BarbeiroOption[]
  onSubmit: (data: MovimentacaoFormData) => void | Promise<void>
  onCancel: () => void
}

export function MovimentacaoForm({
  barbeiros,
  onSubmit,
  onCancel,
}: MovimentacaoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovimentacaoFormData>({
    resolver: zodResolver(movimentacaoSchema),
    defaultValues: {
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      valor: 0,
      tipo: 'entrada',
      barbeiroId: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Tipo"
        options={[
          { value: 'entrada', label: 'Entrada (receita)' },
          { value: 'saida', label: 'Saída (despesa)' },
        ]}
        error={errors.tipo?.message}
        {...register('tipo')}
      />

      <Input
        label="Descrição"
        placeholder="Ex: Compra de produtos, Corte avulso..."
        error={errors.descricao?.message}
        {...register('descricao')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Data"
          type="date"
          error={errors.data?.message}
          {...register('data')}
        />

        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          error={errors.valor?.message}
          {...register('valor')}
        />
      </div>

      <Select
        label="Barbeiro"
        placeholder="Nenhum (opcional)"
        options={barbeiros.map((b) => ({ value: b.id, label: b.nome }))}
        error={errors.barbeiroId?.message}
        {...register('barbeiroId')}
      />

      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Registrar
        </Button>
      </FormActions>
    </form>
  )
}
