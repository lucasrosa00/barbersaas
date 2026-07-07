import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { HeaderActionsProvider } from '@/contexts/HeaderActionsContext'
import { useAuth } from '@/hooks/useAuth'

export function MainLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const openSidebar = useCallback(() => setSidebarOpen(true), [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  useEffect(() => {
    if (!sidebarOpen) return

    function handleResize() {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-neutral-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        onMobileClose={closeSidebar}
      />

      <div className="lg:pl-64">
        <HeaderActionsProvider>
          <Header onMenuClick={openSidebar} />

          <main className="min-h-[calc(100dvh-3.5rem)] p-4 sm:min-h-[calc(100dvh-4rem)] sm:p-6">
            <Outlet />
          </main>
        </HeaderActionsProvider>
      </div>
    </div>
  )
}
