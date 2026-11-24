import { notFound } from "next/navigation"
import { catalogue } from "@/services/catalogue"
import { Breadcrumbs } from "@/components/shared/page-header"
import { MotorcycleDetail } from "@/features/motorcycles/components/motorcycle-detail"
export async function generateStaticParams() {
  return (await catalogue.list()).map((b) => ({ id: b.id }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const b = await catalogue.find((await params).id)
  return { title: b ? `${b.brand} ${b.name}` : "Motorcycle not found" }
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bike = await catalogue.find((await params).id)
  if (!bike) notFound()
  return (
    <div className="container-wide py-10">
      <Breadcrumbs
        items={[
          { label: "Motorcycles", href: "/motorcycles" },
          { label: bike.name },
        ]}
      />
      <MotorcycleDetail bike={bike} />
    </div>
  )
}
