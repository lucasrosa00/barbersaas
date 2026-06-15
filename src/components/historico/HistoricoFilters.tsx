import { Filter, X } from 'lucide-react'
import type { HistoricoFiltros } from '@/types/historico'
import type { Cliente } from '@/types/cliente'
import { labels } from '@/constants/terminology'
import type { Barbeiro } from '@/types/barbeiro'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface HistoricoFiltersProps {
  filtros: HistoricoFiltros
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  onUpdate: <K extends keyof HistoricoFiltros>(
    key: K,
    value: HistoricoFiltros[K],
  ) => void
  onLimpar: () => void
}

export function HistoricoFilters({
  filtros,
  clientes,
  barbeiros,
  onUpdate,
  onLimpar,
}: HistoricoFiltersProps) {
  const temFiltrosAtivos =
    filtros.clienteId ||
    filtros.barbeiroId ||
    filtros.dataInicio ||
    filtros.dataFim

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-600">
        <Filter className="h-4 w-4" />
        Filtros
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Cliente"
          value={filtros.clienteId}
          onChange={(e) => onUpdate('clienteId', e.target.value)}
          options={[
            { value: '', label: 'Todos os clientes' },
            ...clientes.map((c) => ({ value: c.id, label: c.nome })),
          ]}
        />

        <Select
          label={labels.professional.one}
          value={filtros.barbeiroId}
          onChange={(e) => onUpdate('barbeiroId', e.target.value)}
          options={[
            { value: '', label: labels.professional.all },
            ...barbeiros.map((b) => ({ value: b.id, label: b.nome })),
          ]}
        />

        <Input
          label="Data início"
          type="date"
          value={filtros.dataInicio}
          onChange={(e) => onUpdate('dataInicio', e.target.value)}
        />

        <Input
          label="Data fim"
          type="date"
          value={filtros.dataFim}
          onChange={(e) => onUpdate('dataFim', e.target.value)}
        />
      </div>

      {temFiltrosAtivos && (
        <div className="mt-4 flex justify-stretch sm:justify-end">
          <Button variant="ghost" onClick={onLimpar} className="w-full sm:w-auto">
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
