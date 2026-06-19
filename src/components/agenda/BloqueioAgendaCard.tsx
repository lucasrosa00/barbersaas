import { Repeat } from 'lucide-react'
import type { BloqueioHorario } from '@/types/bloqueioHorario'
import { getTipoBloqueioLabel } from '@/constants/tipoBloqueio'

interface BloqueioAgendaCardProps {
  bloqueio: BloqueioHorario
}

export function BloqueioAgendaCard({ bloqueio }: BloqueioAgendaCardProps) {
  return (
    <div
      className="flex h-full flex-col justify-center rounded-md border border-amber-300/80 bg-[repeating-linear-gradient(-45deg,#fef3c7,#fef3c7_8px,#fde68a_8px,#fde68a_16px)] px-1.5 py-1 text-[10px] leading-tight text-amber-950 sm:px-2 sm:text-xs"
      title={`${getTipoBloqueioLabel(bloqueio.tipo)}: ${bloqueio.motivo}`}
    >
      <div className="flex items-center gap-1 font-semibold">
        {bloqueio.tipo === 'fixo' && <Repeat className="h-3 w-3 shrink-0" />}
        <span className="truncate">Bloqueado</span>
      </div>
      <p className="mt-0.5 line-clamp-2 font-medium">{bloqueio.motivo}</p>
      <p className="mt-0.5 truncate text-[9px] opacity-80 sm:text-[10px]">
        {bloqueio.horarioInicio} — {bloqueio.horarioFim}
      </p>
    </div>
  )
}
