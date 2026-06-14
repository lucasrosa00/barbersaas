import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/ui/FormActions'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ListaEsperaFormData } from '@/types/listaEspera'
import type { Cliente } from '@/types/cliente'
import type { Barbeiro } from '@/types/barbeiro'
import type { Servico } from '@/types/servico'
import { toISODate } from '@/utils/timeSlots'

const schema = z.object({
  clienteId: z.string().min(1, 'Selecione um cliente'),
  servicoId: z.string().min(1, 'Selecione um serviço'),
  barbeiroId: z.string(),
  dataSolicitada: z.string().min(1, 'Data é obrigatória'),
})

interface ListaEsperaFormProps {
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  servicos: Servico[]
  onSubmit: (data: ListaEsperaFormData) => void | Promise<void>
  onCancel: () => void
}

export function ListaEsperaForm({
  clientes,
  barbeiros,
  servicos,
  onSubmit,
  onCancel,
}: ListaEsperaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ListaEsperaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clienteId: '',
      servicoId: '',
      barbeiroId: '',
      dataSolicitada: toISODate(new Date()),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Cliente"
        placeholder="Selecione o cliente"
        options={clientes.map((c) => ({ value: c.id, label: c.nome }))}
        error={errors.clienteId?.message}
        {...register('clienteId')}
      />

      <Select
        label="Serviço desejado"
        placeholder="Selecione o serviço"
        options={servicos.map((s) => ({
          value: s.id,
          label: `${s.nome} (${s.duracaoMinutos} min)`,
        }))}
        error={errors.servicoId?.message}
        {...register('servicoId')}
      />

      <Select
        label="Barbeiro preferencial"
        options={[
          { value: '', label: 'Sem preferência' },
          ...barbeiros.map((b) => ({ value: b.id, label: b.nome })),
        ]}
        error={errors.barbeiroId?.message}
        {...register('barbeiroId')}
      />

      <Input
        label="Data solicitada"
        type="date"
        error={errors.dataSolicitada?.message}
        {...register('dataSolicitada')}
      />

      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Adicionar à fila
        </Button>
      </FormActions>
    </form>
  )
}
