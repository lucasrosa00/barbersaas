import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, User, X } from 'lucide-react'
import { navItems } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { EmpresaLogo } from '@/components/ui/EmpresaLogo'

interface SidebarProps {
  onLogout: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({
  onLogout,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    onMobileClose?.()
  }, [pathname, onMobileClose])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[min(100vw-3rem,17rem)] flex-col border-r border-neutral-800 bg-black transition-transform duration-200 ease-out lg:w-64 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-neutral-800 px-4 lg:px-5">
        <EmpresaLogo
          src={user?.empresa.logo}
          alt={user?.empresa.nome ?? 'Logo da empresa'}
          size="lg"
          variant="light"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">Sistema</p>
          <p className="truncate text-xs text-neutral-400">{user?.empresa.nome}</p>
        </div>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 lg:p-4">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = pathname === path

          return (
            <Link
              key={path}
              to={path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-neutral-800 p-3 lg:p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <EmpresaLogo
            src={user?.empresa.logo}
            alt={user?.empresa.nome ?? 'Logo da empresa'}
            size="md"
            variant="dark"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.nome}</p>
            <p className="truncate text-xs capitalize text-neutral-500">{user?.role}</p>
          </div>
          <User className="h-4 w-4 shrink-0 text-neutral-600" />
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-400 hover:bg-neutral-900 hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
