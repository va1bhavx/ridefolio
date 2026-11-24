import type { FuelEntry } from "@/types/models"
export function fuelSummary(entries: FuelEntry[]) {
  const sorted = [...entries].sort((a, b) => a.odometer - b.odometer)
  let anchor: FuelEntry | undefined,
    intervalLitres = 0,
    totalDistance = 0,
    reliableLitres = 0,
    intervals = 0
  for (const entry of sorted) {
    if (anchor) intervalLitres += entry.litres
    if (entry.fullTank) {
      if (anchor && entry.odometer > anchor.odometer && intervalLitres > 0) {
        totalDistance += entry.odometer - anchor.odometer
        reliableLitres += intervalLitres
        intervals++
      }
      anchor = entry
      intervalLitres = 0
    }
  }
  return {
    amount: entries.reduce((s, e) => s + e.amount, 0),
    litres: entries.reduce((s, e) => s + e.litres, 0),
    mileage: reliableLitres ? totalDistance / reliableLitres : null,
    intervals,
  }
}
