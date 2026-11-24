import type { OwnershipData } from "@/types/models"
export function expenseLedger(data: OwnershipData) {
  return [
    ...data.expenses.map((e) => ({ ...e, origin: "expenses" as const })),
    ...data.fuel.map((e) => ({
      ...e,
      category: "Fuel",
      description: "Fuel refill",
      origin: "fuel" as const,
    })),
    ...data.services.map((e) => ({
      ...e,
      category: "Servicing",
      description: e.work,
      origin: "services" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))
}
export function expenseSummary(
  data: OwnershipData,
  bikeId?: string,
  from = "",
  to = "9999-12-31"
) {
  const entries = expenseLedger(data).filter(
    (e) => (!bikeId || e.bikeId === bikeId) && e.date >= from && e.date <= to
  )
  const categories = [
    "Fuel",
    "Servicing",
    "Repairs",
    "Parts and accessories",
    "Other",
  ].map((name) => ({
    name,
    amount: entries
      .filter((e) => e.category === name)
      .reduce((sum, e) => sum + e.amount, 0),
  }))
  return {
    entries,
    categories,
    total: entries.reduce((sum, e) => sum + e.amount, 0),
  }
}
