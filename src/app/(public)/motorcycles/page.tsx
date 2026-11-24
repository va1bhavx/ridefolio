import { catalogue } from "@/services/catalogue"
import { PageHeader, Breadcrumbs } from "@/components/shared/page-header"
import { CatalogueBrowser } from "@/features/motorcycles/components/catalogue-browser"
export const metadata = { title: "Explore motorcycles" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  const { brand } = await searchParams
  return (
    <div className="container-wide py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Motorcycles" }]} />
      <PageHeader
        eyebrow="The Ridefolio catalogue"
        title="Find your kind of ride."
        description="Explore the machines. Understand the details. Discover what speaks to you."
      />
      <CatalogueBrowser
        motorcycles={await catalogue.list()}
        initialBrand={brand}
      />
    </div>
  )
}
