import { demoOwnership } from "@/services/mock/ownership-data"
import { expenseSummary } from "@/features/expenses"
import { fuelSummary } from "@/features/fuel"
import { currency, number } from "@/lib/formatters"
export function demoPreview() {
  const data = demoOwnership(),
    bike = data.garage[0],
    fuel = fuelSummary(data.fuel.filter((e) => e.bikeId === bike.id))
  return [
    [number(bike.odometer), "Kilometres"],
    [number(fuel.mileage || 0, 1), "km/l · full-tank"],
    [currency(expenseSummary(data, bike.id).total), "Recorded spend"],
  ]
}
