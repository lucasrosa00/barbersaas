import { useState } from 'react'
import { Building2 } from 'lucide-react'

type EmpresaLogoSize = 'sm' | 'md' | 'lg'

interface EmpresaLogoProps {
  src?: string | null
  alt?: string
  size?: EmpresaLogoSize
  variant?: 'light' | 'dark'
  className?: string
}

const containerSizes: Record<EmpresaLogoSize, string> = {
  sm: 'h-11 w-11',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
}

const iconSizes: Record<EmpresaLogoSize, string> = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
}

export function EmpresaLogo({
  src,
  alt = 'Logo da empresa',
  size = 'md',
  variant = 'light',
  className = '',
}: EmpresaLogoProps) {
  const [hasError, setHasError] = useState(false)
  const showFallback = !src || hasError

  const containerClass = [
    'flex shrink-0 items-center justify-center overflow-hidden rounded-lg',
    containerSizes[size],
    variant === 'light'
      ? 'border border-neutral-200 bg-white'
      : 'border border-neutral-700 bg-neutral-900',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (showFallback) {
    return (
      <div className={containerClass} title={alt}>
        <Building2
          className={`${iconSizes[size]} ${variant === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}
          aria-hidden
        />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-lg object-contain p-0.5"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
