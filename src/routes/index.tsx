import { createBrowserRouter, Navigate } from 'react-router-dom'
import { appBasename } from '@/config/app'
import { ROUTES } from '@/constants/terminology'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AgendaPage } from '@/pages/agenda/AgendaPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { BloqueiosHorarioPage } from '@/pages/bloqueios/BloqueiosHorarioPage'
import { BarbeirosPage } from '@/pages/barbeiros/BarbeirosPage'
import { ClientesPage } from '@/pages/clientes/ClientesPage'
import { AniversariantesPage } from '@/pages/aniversariantes/AniversariantesPage'
import { ConfiguracoesPage } from '@/pages/configuracoes/ConfiguracoesPage'
import { ConfirmacaoPage } from '@/pages/confirmacao/ConfirmacaoPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { FinanceiroPage } from '@/pages/financeiro/FinanceiroPage'
import { HistoricoPage } from '@/pages/historico/HistoricoPage'
import { ListaEsperaPage } from '@/pages/lista-espera/ListaEsperaPage'
import { ServicosPage } from '@/pages/servicos/ServicosPage'

export const router = createBrowserRouter(
  [
  {
    path: '/confirmacao/:token',
    element: <ConfirmacaoPage />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/recuperar-senha', element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/clientes', element: <ClientesPage /> },
          { path: '/aniversariantes', element: <AniversariantesPage /> },
          { path: ROUTES.professionals, element: <BarbeirosPage /> },
          { path: '/barbeiros', element: <Navigate to={ROUTES.professionals} replace /> },
          { path: '/servicos', element: <ServicosPage /> },
          { path: '/agenda', element: <AgendaPage /> },
          { path: '/bloqueios-horario', element: <BloqueiosHorarioPage /> },
          { path: '/lista-espera', element: <ListaEsperaPage /> },
          { path: '/historico', element: <HistoricoPage /> },
          { path: '/financeiro', element: <FinanceiroPage /> },
          { path: '/configuracoes', element: <ConfiguracoesPage /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
  ],
  { basename: appBasename },
)
