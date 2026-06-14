import { useState } from 'react'
import { ApiError } from '@/services/api/client'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Erro ao fazer login',
      )
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Bem-vindo de volta</h2>
        <p className="text-sm text-neutral-500">
          Entre com suas credenciais para acessar o painel
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-neutral-400 bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
            {error}
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* <div className="flex justify-end">
          <Link
            to="/recuperar-senha"
            className="text-sm text-neutral-900 hover:text-neutral-700"
          >
            Esqueceu a senha?
          </Link>
        </div> */}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Entrar
        </Button>
      </form>

      {/* <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium text-neutral-500">
          Contas de demonstração:
        </p>
        <ul className="space-y-1 text-xs text-neutral-500">
          <li>joao@barbeariadojoao.com / 123456 (owner)</li>
          <li>maria@barbeariadojoao.com / 123456 (admin)</li>
          <li>carlos@corteestilo.com / 123456 (owner)</li>
        </ul>
      </div> */}
    </div>
  )
}
