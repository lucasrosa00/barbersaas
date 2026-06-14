interface PagePlaceholderProps {
  title: string
  description?: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        {description ?? 'Conteúdo em desenvolvimento.'}
      </p>
    </div>
  )
}
