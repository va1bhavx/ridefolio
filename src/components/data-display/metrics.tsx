export function Metrics({
  items,
}: {
  items: { label: string; value: string; note?: string }[]
}) {
  return (
    <dl className="mb-8 grid grid-cols-2 divide-x divide-border border-y lg:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="py-6 pr-3 pl-4 first:pl-0">
          <dt className="text-sm text-muted-foreground">{i.label}</dt>
          <dd className="mt-2 font-mono text-2xl font-medium tracking-tight md:text-3xl">
            {i.value}
          </dd>
          {i.note && (
            <p className="mt-2 text-xs text-muted-foreground">{i.note}</p>
          )}
        </div>
      ))}
    </dl>
  )
}
export function Status({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "success" | "warning"
}) {
  const style =
    tone === "warning"
      ? "bg-warning/10 text-warning"
      : tone === "success"
        ? "bg-success/10 text-success"
        : "bg-secondary text-muted-foreground"
  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs font-medium ${style}`}
    >
      {children}
    </span>
  )
}
