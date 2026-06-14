import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '@/services/auth/authService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const forgotSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotFormData) {
    setError(null)
    try {
      await authService.forgotPassword(data.email)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao enviar recuperação',
      )
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
          <CheckCircle className="h-7 w-7 text-neutral-900" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">E-mail enviado!</h2>
          <p className="text-sm text-neutral-500">
            Se o e-mail estiver cadastrado, você receberá instruções para
            redefinir sua senha.
          </p>
        </div>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Recuperar senha</h2>
        <p className="text-sm text-neutral-500">
          Informe seu e-mail e enviaremos as instruções de recuperação
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

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Enviar instruções
        </Button>
      </form>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao login
      </Link>
    </div>
  )
}
