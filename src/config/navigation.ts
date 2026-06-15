import {
  Calendar,
  ClipboardList,
  History,
  LayoutDashboard,
  ListOrdered,
  Settings,
  UserCircle,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { labels, ROUTES } from '@/constants/terminology'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', path: '/clientes', icon: Users },
  { label: labels.professional.many, path: ROUTES.professionals, icon: UserCircle },
  { label: 'Serviços', path: '/servicos', icon: ClipboardList },
  { label: 'Agenda', path: '/agenda', icon: Calendar },
  { label: 'Lista de Espera', path: '/lista-espera', icon: ListOrdered },
  { label: 'Histórico', path: '/historico', icon: History },
  { label: 'Financeiro', path: '/financeiro', icon: Wallet },
  { label: 'Configurações da Empresa', path: '/configuracoes', icon: Settings },
]

export function getNavItemByPath(pathname: string): NavItem | undefined {
  return navItems.find((item) => item.path === pathname)
}
