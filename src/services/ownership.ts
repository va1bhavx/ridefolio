import type { OwnershipRepository } from "./interfaces/repositories"
import type { Collection, OwnershipData } from "@/types/models"
import { persistence } from "./persistence"
import { demoOwnership } from "./mock/ownership-data"
function read(userId: string): OwnershipData {
  return persistence.read(`ownership:${userId}`, demoOwnership())
}
export const ownership: OwnershipRepository = {
  async read(userId) {
    return read(userId)
  },
  async save<K extends Collection>(
    userId: string,
    collection: K,
    item: OwnershipData[K][number]
  ) {
    const data = read(userId)
    if (
      collection !== "garage" &&
      "bikeId" in item &&
      !data.garage.some((b) => b.id === item.bikeId)
    )
      throw new Error("Choose a motorcycle that is in your garage.")
    const items = data[collection] as OwnershipData[K][number][]
    const index = items.findIndex((e) => e.id === item.id)
    if (index < 0) items.push(item)
    else items[index] = item
    if (
      "odometer" in item &&
      "bikeId" in item &&
      typeof item.odometer === "number" &&
      collection !== "reminders"
    ) {
      const bike = data.garage.find((b) => b.id === item.bikeId)
      if (bike) bike.odometer = Math.max(bike.odometer, item.odometer)
    }
    persistence.write(`ownership:${userId}`, data)
  },
  async remove(userId, collection, id) {
    const data = read(userId)
    // Removing a motorcycle cascades its demo records after explicit UI confirmation.
    if (collection === "garage") {
      data.fuel = data.fuel.filter((e) => e.bikeId !== id)
      data.expenses = data.expenses.filter((e) => e.bikeId !== id)
      data.services = data.services.filter((e) => e.bikeId !== id)
      data.reminders = data.reminders.filter((e) => e.bikeId !== id)
    }
    Object.assign(data, {
      [collection]: data[collection].filter((e) => e.id !== id),
    })
    persistence.write(`ownership:${userId}`, data)
  },
  async preferences(userId, value) {
    persistence.write(`ownership:${userId}`, {
      ...read(userId),
      preferences: value,
    })
  },
}
