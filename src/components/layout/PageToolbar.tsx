import type { ReactNode } from 'react'

interface PageToolbarProps {
  children: ReactNode
}

export function PageToolbar({ children }: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  )
}

export function PageToolbarActions({ children }: PageToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      {children}
    </div>
  )
}

export function TableScrollWrapper({ children }: PageToolbarProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">{children}</div>
  )
}
