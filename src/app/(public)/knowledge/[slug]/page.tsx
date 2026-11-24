import Link from "next/link"
import { notFound } from "next/navigation"
import { catalogue } from "@/services/catalogue"
import { Breadcrumbs } from "@/components/shared/page-header"
import { KnowledgeNav } from "@/components/navigation/knowledge-nav"
export async function generateStaticParams() {
  return (await catalogue.articles()).map((a) => ({ slug: a.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return {
    title:
      (await catalogue.article((await params).slug))?.title ||
      "Guide not found",
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const a = await catalogue.article((await params).slug)
  if (!a) notFound()
  const bikes = (await catalogue.list()).filter((b) =>
    a.motorcycles.includes(b.id)
  )
  const related = (await catalogue.articles())
    .filter((b) => b.slug !== a.slug)
    .slice(0, 3)
  return (
    <article className="container-wide py-12">
      <Breadcrumbs
        items={[
          { label: "Knowledge", href: "/knowledge" },
          { label: a.category },
        ]}
      />
      <div className="max-w-3xl">
        <p className="eyebrow">
          {a.category} · {a.minutes} min read · Beginner friendly
        </p>
        <h1 className="page-title mt-5 leading-tight md:text-5xl">{a.title}</h1>
        <p className="mt-6 text-xl leading-8 text-muted-foreground">
          {a.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px]">
        <div className="max-w-3xl">
          {a.sections.map((s, i) => (
            <section
              id={`section-${i}`}
              key={s.title}
              className="mb-10 scroll-mt-8"
            >
              <h2 className="section-title text-2xl">{s.title}</h2>
              <p className="reading mt-4">{s.body}</p>
            </section>
          ))}
          <p className="border-t pt-5 text-sm leading-6 text-muted-foreground">
            General educational demo content. Your exact motorcycle’s owner’s
            manual and qualified service advice take precedence.
          </p>
          <h2 className="mt-10 text-xl font-semibold">
            Explore the motorcycles
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {bikes.map((b) => (
              <Link
                className="link-secondary"
                key={b.id}
                href={`/motorcycles/${b.id}`}
              >
                {b.brand} {b.name}
              </Link>
            ))}
          </div>
        </div>
        <aside>
          <KnowledgeNav sections={a.sections} />
          <h2 className="mt-8 text-sm font-semibold">Keep exploring</h2>
          {related.map((r) => (
            <Link
              className="block border-b py-4 text-sm text-primary"
              href={`/knowledge/${r.slug}`}
              key={r.slug}
            >
              {r.title}
            </Link>
          ))}
        </aside>
      </div>
    </article>
  )
}
