import { catalogue } from "@/services/catalogue"
import { Maintenance } from "@/features/maintenance/components/maintenance"
export const metadata = { title: "Maintenance" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; bike?: string }>
}) {
  return (
    <Maintenance
      bikes={await catalogue.list()}
      initialAdd={(await searchParams).add === "1"}
      initialBike={(await searchParams).bike}
    />
  )
}
