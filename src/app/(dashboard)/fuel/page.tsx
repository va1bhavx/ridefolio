import { catalogue } from "@/services/catalogue"
import { Fuel } from "@/features/fuel/components/fuel"
export const metadata = { title: "Fuel & mileage" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; bike?: string }>
}) {
  return (
    <Fuel
      bikes={await catalogue.list()}
      initialAdd={(await searchParams).add === "1"}
      initialBike={(await searchParams).bike}
    />
  )
}
