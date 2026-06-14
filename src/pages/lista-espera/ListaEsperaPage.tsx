import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { AgendamentoFormModal } from '@/components/agenda/AgendamentoFormModal'
import { ListaEsperaFormModal } from '@/components/listaEspera/ListaEsperaFormModal'
import { ListaEsperaList } from '@/components/listaEspera/ListaEsperaList'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useClientes } from '@/hooks/useClientes'
import { useListaEspera } from '@/hooks/useListaEspera'
import { useServicos } from '@/hooks/useServicos'
import { agendamentoService } from '@/services/agenda/agendamentoService'
import type { AgendamentoEnriquecido, AgendamentoFormData } from '@/types/agendamento'
import type { ListaEsperaFormData, ListaEsperaItem } from '@/types/listaEspera'
import { getPrimeiroHorarioDisponivel } from '@/utils/agenda'

export function ListaEsperaPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''

  const {
    itens,
    isLoading,
    addItem,
    removeItem,
    moveUp,
    moveDown,
  } = useListaEspera(empresaId)

  const { clientes } = useClientes(empresaId)
  const { barbeiros } = useBarbeiros(empresaId)
  const { servicos } = useServicos(empresaId)

  const [formOpen, setFormOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [convertingItem, setConvertingItem] = useState<ListaEsperaItem | undefined>()
  const [removingId, setRemovingId] = useState<string | undefined>()
  const [agendamentos, setAgendamentos] = useState<AgendamentoEnriquecido[]>([])

  const loadAgendamentos = useCallback(async () => {
    if (!empresaId) return
    const data = await agendamentoService.list(empresaId)
    setAgendamentos(data)
  }, [empresaId])

  useEffect(() => {
    loadAgendamentos()
  }, [loadAgendamentos])

  async function handleAdd(data: ListaEsperaFormData) {
    await addItem(data)
  }

  async function handleConvert(item: ListaEsperaItem) {
    await loadAgendamentos()
    setConvertingItem(item)
    setConvertOpen(true)
  }

  async function handleConfirmConvert(data: AgendamentoFormData) {
    if (!convertingItem) return

    await agendamentoService.create(empresaId, data)
    await removeItem(convertingItem.id)
    await loadAgendamentos()
    setConvertingItem(undefined)
  }

  async function handleConfirmRemove() {
    if (removingId) {
      await removeItem(removingId)
      setRemovingId(undefined)
    }
  }

  const prefilledAgendamento = useMemo((): Partial<AgendamentoFormData> | undefined => {
    if (!convertingItem) return undefined

    const servico = servicos.find((s) => s.id === convertingItem.servicoId)
    const barbeiro = convertingItem.barbeiroId
      ? barbeiros.find((b) => b.id === convertingItem.barbeiroId)
      : undefined

    const horario =
      barbeiro && servico
        ? getPrimeiroHorarioDisponivel(
            barbeiro,
            agendamentos,
            servico.duracaoMinutos,
            convertingItem.dataSolicitada,
          )
        : undefined

    return {
      clienteId: convertingItem.clienteId,
      servicoId: convertingItem.servicoId,
      barbeiroId: convertingItem.barbeiroId || undefined,
      data: convertingItem.dataSolicitada,
      horario,
      status: 'agendado',
    }
  }, [convertingItem, servicos, barbeiros, agendamentos])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-500">
          {itens.length}{' '}
          {itens.length === 1 ? 'cliente na fila' : 'clientes na fila'}
        </p>

        <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Adicionar à fila
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <ListaEsperaList
          itens={itens}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onRemove={setRemovingId}
          onConvert={handleConvert}
        />
      )}

      <ListaEsperaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
        clientes={clientes}
        barbeiros={barbeiros}
        servicos={servicos}
      />

      <AgendamentoFormModal
        open={convertOpen}
        onClose={() => {
          setConvertOpen(false)
          setConvertingItem(undefined)
        }}
        onSubmit={handleConfirmConvert}
        prefilled={prefilledAgendamento}
        agendamentos={agendamentos}
        clientes={clientes}
        barbeiros={barbeiros}
        servicos={servicos}
      />

      <ConfirmDialog
        open={!!removingId}
        onClose={() => setRemovingId(undefined)}
        onConfirm={handleConfirmRemove}
        title="Remover da fila"
        description="Tem certeza que deseja remover este cliente da lista de espera?"
        confirmLabel="Remover"
      />
    </div>
  )
}
