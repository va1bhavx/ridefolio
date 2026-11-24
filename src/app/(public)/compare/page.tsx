import { catalogue } from "@/services/catalogue"
import { PageHeader } from "@/components/shared/page-header"
import { Comparison } from "@/features/comparison/components/comparison"
export const metadata = { title: "Compare motorcycles" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ first?: string }>
}) {
  return (
    <div className="container-wide section-space">
      <PageHeader
        eyebrow="A closer look"
        title="The details, side by side."
        description="Compare two motorcycles and understand the differences behind the numbers."
      />
      <Comparison
        bikes={await catalogue.list()}
        initialFirst={(await searchParams).first}
      />
    </div>
  )
}
