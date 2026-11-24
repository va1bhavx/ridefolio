import { catalogue } from "@/services/catalogue"
import { Overview } from "@/features/dashboard/components/overview"
export const metadata = { title: "Ownership overview" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ bike?: string }>
}) {
  return (
    <Overview
      bikes={await catalogue.list()}
      initialBike={(await searchParams).bike}
    />
  )
}
