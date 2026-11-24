import { catalogue } from "@/services/catalogue"
import { Expenses } from "@/features/expenses/components/expenses"
export const metadata = { title: "Expenses" }
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ add?: string; bike?: string }>
}) {
  return (
    <Expenses
      bikes={await catalogue.list()}
      initialAdd={(await searchParams).add === "1"}
      initialBike={(await searchParams).bike}
    />
  )
}
