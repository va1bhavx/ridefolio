import Link from "next/link"
import { catalogue } from "@/services/catalogue"
import { PageHeader } from "@/components/shared/page-header"
import { KnowledgeBrowser } from "@/features/knowledge/components/knowledge-browser"
export const metadata = { title: "Knowledge centre" }
export default async function Page() {
  return (
    <div className="container-wide section-space">
      <PageHeader
        eyebrow="Curiosity is part of the ride"
        title="Know the why behind the ride."
        description="Clear explanations. Useful context. Motorcycle knowledge, without the jargon."
      />
      <Link
        href="/knowledge/engines"
        className="mb-12 block rounded-lg bg-secondary p-8 md:p-12"
      >
        <p className="eyebrow">Featured guide / Engines</p>
        <h2 className="section-title mt-4">
          There’s more to a motorcycle than its cc.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Understand power, torque and the character of an engine — and why the
          biggest number isn’t always the most useful one.
        </p>
        <p className="mt-6 text-sm font-medium text-primary">
          Start with the essentials
        </p>
      </Link>
      <KnowledgeBrowser articles={await catalogue.articles()} />
    </div>
  )
}
