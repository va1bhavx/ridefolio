import Link from "next/link"
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7 text-sm text-muted-foreground">
      <ol className="flex flex-wrap gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((i) => (
          <li key={i.label} className="flex gap-2">
            <span aria-hidden>/</span>
            {i.href ? (
              <Link href={i.href}>{i.label}</Link>
            ) : (
              <span aria-current="page">{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
