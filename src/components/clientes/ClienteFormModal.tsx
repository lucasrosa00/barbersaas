import { Modal } from '@/components/ui/Modal'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import type { Cliente, ClienteFormData } from '@/types/cliente'

interface ClienteFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ClienteFormData) => void
  cliente?: Cliente
}

export function ClienteFormModal({
  open,
  onClose,
  onSubmit,
  cliente,
}: ClienteFormModalProps) {
  const isEditing = !!cliente

  function handleSubmit(data: ClienteFormData) {
    onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
    >
      <ClienteForm
        key={cliente?.id ?? 'new'}
        defaultValues={cliente}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar'}
      />
    </Modal>
  )
}
