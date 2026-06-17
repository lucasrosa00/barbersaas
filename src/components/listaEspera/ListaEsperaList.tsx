import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CalendarCheck,
  ClipboardList,
  Trash2,
  User,
} from 'lucide-react'
import type { ListaEsperaItem } from '@/types/listaEspera'
import { labels } from '@/constants/terminology'
import { Button } from '@/components/ui/Button'
import { formatDateBR } from '@/utils/timeSlots'

interface ListaEsperaListProps {
  itens: ListaEsperaItem[]
  total: number
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onRemove: (id: string) => void
  onConvert: (item: ListaEsperaItem) => void
}

export function ListaEsperaList({
  itens,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  onConvert,
}: ListaEsperaListProps) {
  if (itens.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Nenhum cliente na lista de espera.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {itens.map((item) => (
        <article
          key={item.id}
          className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-bold text-neutral-900">
            {item.posicao}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-neutral-500" />
              <p className="truncate font-semibold text-neutral-900">
                {item.clienteNome}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5" />
                {item.servicoNome}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateBR(item.dataSolicitada)}
              </span>
              <span className="text-neutral-500">
                {labels.professional.one}: {item.barbeiroNome}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              variant="ghost"
              className="px-2 sm:flex-1 sm:flex-none"
              onClick={() => onMoveUp(item.id)}
              disabled={item.posicao <= 1}
              aria-label="Subir posição"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sm:hidden">Subir</span>
            </Button>
            <Button
              variant="ghost"
              className="px-2 sm:flex-1 sm:flex-none"
              onClick={() => onMoveDown(item.id)}
              disabled={item.posicao >= total}
              aria-label="Descer posição"
            >
              <ArrowDown className="h-4 w-4" />
              <span className="sm:hidden">Descer</span>
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => onConvert(item)}
            >
              <CalendarCheck className="h-4 w-4" />
              Agendar
            </Button>

            <Button
              variant="ghost"
              className="w-full px-2 text-neutral-600 hover:text-neutral-800 sm:w-auto"
              onClick={() => onRemove(item.id)}
              aria-label="Remover da fila"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sm:hidden">Remover</span>
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
