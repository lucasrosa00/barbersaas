import { Outlet } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-1/2 flex-col justify-between bg-black p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <Scissors className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">BarberSaaS</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Gerencie sua barbearia com inteligência
          </h1>
          <p className="text-lg text-neutral-400">
            Agendamentos, equipe e clientes em um só lugar. Multiempresa,
            multi-unidade, pronto para escalar.
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} BarberSaaS. Todos os direitos reservados.
        </p>
      </aside>

      <main className="flex w-full flex-col items-center justify-center bg-neutral-50 px-6 py-12 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-900">BarberSaaS</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
