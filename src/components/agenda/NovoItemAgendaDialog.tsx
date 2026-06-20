import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface NovoItemAgendaDialogProps {
  open: boolean
  onClose: () => void
  onSelectAgendamento: () => void
  onSelectBloqueio: () => void
}

export function NovoItemAgendaDialog({
  open,
  onClose,
  onSelectAgendamento,
  onSelectBloqueio,
}: NovoItemAgendaDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="O que você deseja cadastrar?">
      <p className="text-sm text-neutral-500">
        Escolha se deseja criar um agendamento ou um bloqueio de horário.
      </p>

      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={onSelectAgendamento}>
          Novo agendamento
        </Button>
        <Button className="w-full" variant="secondary" onClick={onSelectBloqueio}>
          Novo bloqueio de horário
        </Button>
      </div>

      <div className="mt-6">
        <Button className="w-full" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  )
}

