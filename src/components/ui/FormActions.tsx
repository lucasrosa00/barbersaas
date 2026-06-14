import type { ReactNode } from 'react'

interface FormActionsProps {
  children: ReactNode
  align?: 'end' | 'between'
}

export function FormActions({ children, align = 'end' }: FormActionsProps) {
  return (
    <div
      className={`flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center ${
        align === 'between' ? 'sm:justify-between' : 'sm:justify-end'
      }`}
    >
      {children}
    </div>
  )
}
