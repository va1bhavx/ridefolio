import { catalogue } from "@/services/catalogue"
import { Garage } from "@/features/garage/components/garage"
export const metadata = { title: "My garage" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>
}) {
  return (
    <Garage
      bikes={await catalogue.list()}
      initialModel={(await searchParams).model}
    />
  )
}
