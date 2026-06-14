import type { ReactNode } from 'react'

interface MobileCardActionsProps {
  children: ReactNode
}

export function MobileCardActions({ children }: MobileCardActionsProps) {
  return <div className="flex items-center justify-end gap-1 border-t border-neutral-200 pt-3">{children}</div>
}
