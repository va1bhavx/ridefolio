export function KnowledgeNav({ sections }: { sections: { title: string }[] }) {
  return (
    <nav aria-label="In this guide" className="panel p-5">
      <p className="eyebrow mb-4">In this guide</p>
      <ol className="space-y-3 text-sm">
        {sections.map((s, i) => (
          <li key={s.title}>
            <a
              className="text-muted-foreground hover:text-primary"
              href={`#section-${i}`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
