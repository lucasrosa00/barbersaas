import { Calendar, Clock, Pencil, Phone, Trash2 } from 'lucide-react'
import { getDiaLabel } from '@/constants/diasSemana'
import type { Barbeiro } from '@/types/barbeiro'

interface BarbeiroCardProps {
  barbeiro: Barbeiro
  onEdit: (barbeiro: Barbeiro) => void
  onDelete: (barbeiro: Barbeiro) => void
}

export function BarbeiroCard({ barbeiro, onEdit, onDelete }: BarbeiroCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-900">
          {barbeiro.nome.charAt(0).toUpperCase()}
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(barbeiro)}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label={`Editar ${barbeiro.nome}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(barbeiro)}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label={`Excluir ${barbeiro.nome}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900">{barbeiro.nome}</h3>

      <div className="mt-3 space-y-2 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-neutral-500" />
          <span>{barbeiro.telefone}</span>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
          <span>
            {barbeiro.horarioInicio} — {barbeiro.horarioFim}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
          <span className="leading-relaxed">
            {barbeiro.diasTrabalho.map(getDiaLabel).join(', ')}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {barbeiro.especialidades.map((esp) => (
          <span
            key={esp}
            className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-900"
          >
            {esp}
          </span>
        ))}
      </div>
    </article>
  )
}
