import { Outlet } from 'react-router-dom'
import { AppLogo } from '@/components/ui/AppLogo'
import { labels } from '@/constants/terminology'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-1/2 flex-col justify-between bg-black p-12 lg:flex">
        <div className="flex items-center gap-3">
          <AppLogo size={40} />
          <span className="text-xl font-bold text-white">{labels.appName}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white">
            {labels.public.headline}
          </h1>
          <p className="text-lg text-neutral-400">{labels.public.subheadline}</p>
        </div>

        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} {labels.appName}. Todos os direitos reservados.
        </p>
      </aside>

      <main className="flex w-full flex-col items-center justify-center bg-neutral-50 px-6 py-12 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <AppLogo size={40} />
          <span className="text-xl font-bold text-neutral-900">{labels.appName}</span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
