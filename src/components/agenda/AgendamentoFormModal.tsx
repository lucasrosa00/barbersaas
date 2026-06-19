import { Modal } from '@/components/ui/Modal'
import { AgendamentoForm } from '@/components/agenda/AgendamentoForm'
import { useEmpresaConfig } from '@/hooks/useEmpresaConfig'
import type { AgendamentoEnriquecido, AgendamentoFormData } from '@/types/agendamento'
import type { Cliente, ClienteFormData } from '@/types/cliente'
import type { Barbeiro } from '@/types/barbeiro'
import type { Servico } from '@/types/servico'
import type { BloqueioHorario } from '@/types/bloqueioHorario'
import type { IntervaloSlot } from '@/types/empresaConfig'

interface AgendamentoFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AgendamentoFormData) => void | Promise<void>
  onCancelAgendamento?: () => void
  agendamento?: AgendamentoEnriquecido
  prefilled?: Partial<AgendamentoFormData>
  agendamentos: AgendamentoEnriquecido[]
  bloqueios?: BloqueioHorario[]
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  servicos: Servico[]
  intervaloSlots: IntervaloSlot
  formKey?: string
  onCreateCliente?: (data: ClienteFormData) => Promise<Cliente>
}

export function AgendamentoFormModal({
  open,
  onClose,
  onSubmit,
  onCancelAgendamento,
  agendamento,
  prefilled,
  agendamentos,
  bloqueios = [],
  clientes,
  barbeiros,
  servicos,
  intervaloSlots,
  formKey,
  onCreateCliente,
}: AgendamentoFormModalProps) {
  const isEditing = !!agendamento
  const { config: empresaConfig } = useEmpresaConfig()

  async function handleSubmit(data: AgendamentoFormData) {
    await onSubmit(data)
  }

  const defaultValues = agendamento ?? prefilled
  const resolvedFormKey =
    formKey ?? agendamento?.id ?? `new-${prefilled?.barbeiroId ?? ''}-${prefilled?.horario ?? ''}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
    >
      <AgendamentoForm
        key={resolvedFormKey}
        defaultValues={defaultValues}
        agendamentos={agendamentos}
        bloqueios={bloqueios}
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
        enviarLinkConfirmacaoWhatsApp={empresaConfig?.enviarLinkConfirmacaoWhatsApp}
        onCreateCliente={onCreateCliente}
      />
    </Modal>
  )
}
