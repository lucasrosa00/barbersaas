import { Filter, X } from 'lucide-react'
import { TIPOS_BLOQUEIO } from '@/constants/tipoBloqueio'
import { labels } from '@/constants/terminology'
import type { Barbeiro } from '@/types/barbeiro'
import type { BloqueioHorarioFiltros } from '@/types/bloqueioHorario'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface BloqueiosFiltersProps {
  filtros: BloqueioHorarioFiltros
  barbeiros: Barbeiro[]
  onUpdate: <K extends keyof BloqueioHorarioFiltros>(
    key: K,
    value: BloqueioHorarioFiltros[K],
  ) => void
  onLimpar: () => void
}

export function BloqueiosFilters({
  filtros,
  barbeiros,
  onUpdate,
  onLimpar,
}: BloqueiosFiltersProps) {
  const temFiltrosAtivos = filtros.barbeiroId || filtros.tipo

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-600">
        <Filter className="h-4 w-4" />
        Filtros
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Select
          label={labels.professional.one}
          value={filtros.barbeiroId}
          onChange={(e) => onUpdate('barbeiroId', e.target.value)}
          options={[
            { value: '', label: labels.professional.all },
            ...barbeiros.map((b) => ({ value: b.id, label: b.nome })),
          ]}
        />

        <Select
          label="Tipo de bloqueio"
          value={filtros.tipo}
          onChange={(e) =>
            onUpdate('tipo', e.target.value as BloqueioHorarioFiltros['tipo'])
          }
          options={[
            { value: '', label: 'Todos os tipos' },
            ...TIPOS_BLOQUEIO.map((t) => ({ value: t.value, label: t.label })),
          ]}
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
