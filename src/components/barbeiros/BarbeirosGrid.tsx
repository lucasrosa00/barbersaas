import { labels } from '@/constants/terminology'
import type { Barbeiro } from '@/types/barbeiro'
import { BarbeiroCard } from '@/components/barbeiros/BarbeiroCard'

interface BarbeirosGridProps {
  barbeiros: Barbeiro[]
  onEdit: (barbeiro: Barbeiro) => void
  onDelete: (barbeiro: Barbeiro) => void
}

export function BarbeirosGrid({
  barbeiros,
  onEdit,
  onDelete,
}: BarbeirosGridProps) {
  if (barbeiros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">{labels.professional.noneFound}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {barbeiros.map((barbeiro) => (
        <BarbeiroCard
          key={barbeiro.id}
          barbeiro={barbeiro}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
