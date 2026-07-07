import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getNavItemByPath } from '@/config/navigation'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { useHeaderActionsState } from '@/contexts/HeaderActionsContext'
import { labels } from '@/constants/terminology'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const actions = useHeaderActionsState()
  const currentNav = getNavItemByPath(pathname)

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
            {currentNav?.label ?? labels.appName}
          </h1>
          <p className="truncate text-xs text-neutral-500">{user?.empresa.nome}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <NotificationBell />
        <span className="hidden rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-900 sm:inline-flex">
          {user?.role}
        </span>
      </div>
    </header>
  )
}
