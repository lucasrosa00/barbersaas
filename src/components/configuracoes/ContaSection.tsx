import { LogOut, Shield, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function ContaSection() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <User className="h-6 w-6 text-neutral-900" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-neutral-900">{user.nome}</p>
            <p className="truncate text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs capitalize text-neutral-600 sm:ml-auto">
          <Shield className="h-3.5 w-3.5" />
          {user.role}
        </div>
      </div>

      <Button variant="secondary" onClick={handleLogout} className="w-full sm:w-auto">
        <LogOut className="h-4 w-4" />
        Sair da conta
      </Button>
    </div>
  )
}
