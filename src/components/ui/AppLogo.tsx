import { appLogoUrl, branding } from '@/constants/terminology'

interface AppLogoProps {
  size?: number
  className?: string
  alt?: string
}

export function AppLogo({
  size = 40,
  className = 'rounded-xl object-contain',
  alt = branding.appName,
}: AppLogoProps) {
  return (
    <img
      src={appLogoUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  )
}
