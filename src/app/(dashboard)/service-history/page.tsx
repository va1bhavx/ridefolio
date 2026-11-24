import { catalogue } from "@/services/catalogue"
import { ServiceHistory } from "@/features/service-history/components/service-history"
export const metadata = { title: "Service history" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; bike?: string }>
}) {
  return (
    <ServiceHistory
      bikes={await catalogue.list()}
      initialAdd={(await searchParams).add === "1"}
      initialBike={(await searchParams).bike}
    />
  )
}
