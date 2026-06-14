import { Modal } from '@/components/ui/Modal'
import { AgendamentoForm } from '@/components/agenda/AgendamentoForm'
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig'
import type { AgendamentoEnriquecido, AgendamentoFormData } from '@/types/agendamento'
import type { Cliente } from '@/types/cliente'
import type { Barbeiro } from '@/types/barbeiro'
import type { Servico } from '@/types/servico'
import type { IntervaloSlot } from '@/types/empresaConfig'

interface AgendamentoFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AgendamentoFormData) => void | Promise<void>
  onCancelAgendamento?: () => void
  agendamento?: AgendamentoEnriquecido
  prefilled?: Partial<AgendamentoFormData>
  agendamentos: AgendamentoEnriquecido[]
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  servicos: Servico[]
  intervaloSlots: IntervaloSlot
}

export function AgendamentoFormModal({
  open,
  onClose,
  onSubmit,
  onCancelAgendamento,
  agendamento,
  prefilled,
  agendamentos,
  clientes,
  barbeiros,
  servicos,
  intervaloSlots,
}: AgendamentoFormModalProps) {
  const isEditing = !!agendamento
  const { config: empresaConfig } = useEmpresaConfig()

  async function handleSubmit(data: AgendamentoFormData) {
    await onSubmit(data)
    onClose()
  }

  const defaultValues = agendamento ?? prefilled

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
    >
      <AgendamentoForm
        key={agendamento?.id ?? `${prefilled?.barbeiroId}-${prefilled?.horario}`}
        defaultValues={defaultValues}
        agendamentos={agendamentos}
        editingId={agendamento?.id}
        clientes={clientes}
        barbeiros={barbeiros}
        servicos={servicos}
        intervaloSlots={intervaloSlots}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onCancelAgendamento={onCancelAgendamento}
        isEditing={isEditing}
        submitLabel={isEditing ? 'Salvar alterações' : 'Agendar'}
        empresaNome={empresaConfig?.nome}
      />
    </Modal>
  )
}
