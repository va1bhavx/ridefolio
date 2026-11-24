import test from "node:test"
import assert from "node:assert/strict"
import { fuelSummary } from "../src/features/fuel/calculations"
import { expenseSummary } from "../src/features/expenses/calculations"
import { reminderStatus } from "../src/features/maintenance/calculations"
import { demoOwnership } from "../src/services/mock/ownership-data"
import { fuelSchema } from "../src/features/fuel/schema"
import { registerSchema } from "../src/features/authentication/schemas"
import { feedbackSchema } from "../src/features/feedback/schema"
import { ownership } from "../src/services/ownership"
import { authentication } from "../src/services/authentication"
import type { FuelEntry } from "../src/types/models"
const entry = (
  id: string,
  odometer: number,
  litres: number,
  fullTank: boolean
): FuelEntry => ({
  id,
  bikeId: "bike-1",
  date: "2026-01-01",
  odometer,
  litres,
  fullTank,
  amount: litres * 100,
  notes: "",
})
test("mileage includes partial refills between full tanks and excludes the opening tank", () => {
  const result = fuelSummary([
    entry("a", 1000, 8, true),
    entry("b", 1100, 3, false),
    entry("c", 1300, 7, true),
  ])
  assert.equal(result.mileage, 30)
  assert.equal(result.intervals, 1)
  assert.equal(result.litres, 18)
})
test("incomplete intervals do not produce mileage", () => {
  assert.equal(
    fuelSummary([entry("a", 1000, 8, false), entry("b", 1100, 4, true)])
      .mileage,
    null
  )
  assert.equal(fuelSummary([]).mileage, null)
})
test("multiple intervals use a distance/litres weighted result and accept unordered records", () => {
  const result = fuelSummary([
    entry("c", 1600, 15, true),
    entry("a", 1000, 8, true),
    entry("b", 1300, 10, true),
  ])
  assert.equal(result.mileage, 24)
  assert.equal(result.intervals, 2)
})
test("expenditure counts each source once and supports bike and period filters", () => {
  const data = demoOwnership()
  const all = expenseSummary(data)
  assert.equal(
    all.entries.length,
    data.fuel.length + data.services.length + data.expenses.length
  )
  assert.equal(all.total, 11798)
  assert.equal(expenseSummary(data, "bike-1").total, 9240)
  assert.equal(
    expenseSummary(data, "bike-1", "2026-11-01", "2026-11-30").total,
    1370
  )
})
test("maintenance uses the first reached threshold and completed overrides due", () => {
  const r = demoOwnership().reminders[1]
  assert.equal(reminderStatus(r, 8600, "2026-11-19"), "Due")
  assert.equal(reminderStatus(r, 8000, "2026-11-21"), "Overdue")
  assert.equal(
    reminderStatus({ ...r, completed: true }, 9000, "2026-11-25"),
    "Completed"
  )
})
test("forms reject invalid quantities, future activity, mismatched passwords and missing email consent", () => {
  assert.equal(
    fuelSchema.safeParse({ ...entry("a", 1000, 0, true) }).success,
    false
  )
  assert.equal(
    fuelSchema.safeParse({ ...entry("a", 1000, 10, true), date: "2099-01-01" })
      .success,
    false
  )
  assert.equal(
    registerSchema.safeParse({
      name: "Rider",
      email: "a@example.com",
      password: "Ride12345",
      confirm: "different",
      consent: true,
    }).success,
    false
  )
  assert.equal(
    feedbackSchema.safeParse({
      kind: "General feedback",
      message: "A useful suggestion",
      email: "a@example.com",
      consent: false,
    }).success,
    false
  )
})
test("mock account lifecycle, isolation, persistence, CRUD and cascade deletion", async () => {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: {
        getItem: (k: string) => values.get(k) ?? null,
        setItem: (k: string, v: string) => values.set(k, v),
        removeItem: (k: string) => values.delete(k),
      },
    },
    configurable: true,
  })
  await assert.rejects(authentication.login("demo@ridefolio.app", "wrong"))
  const demo = await authentication.login("demo@ridefolio.app", "Ridefolio123!")
  assert.equal((await ownership.read(demo.id)).garage.length, 2)
  const user = await authentication.register(
    "Test Rider",
    "test@example.com",
    "Unique1234"
  )
  assert.equal((await ownership.read(user.id)).garage.length, 0)
  await assert.rejects(
    authentication.register("Again", "test@example.com", "Unique1234")
  )
  await authentication.signOut()
  assert.equal(await authentication.session(), null)
  await authentication.login("test@example.com", "Unique1234")
  const bike = demoOwnership().garage[0]
  await ownership.save(user.id, "garage", bike)
  await ownership.save(user.id, "fuel", entry("test", 9000, 10, true))
  assert.equal((await ownership.read(user.id)).garage[0].odometer, 9000)
  await ownership.save(user.id, "fuel", {
    ...entry("test", 9000, 10, true),
    amount: 1050,
  })
  assert.equal((await ownership.read(user.id)).fuel.length, 1)
  assert.equal((await ownership.read(user.id)).fuel[0].amount, 1050)
  await ownership.remove(user.id, "garage", bike.id)
  assert.equal((await ownership.read(user.id)).fuel.length, 0)
  assert.equal((await ownership.read(demo.id)).garage.length, 2)
  delete (globalThis as { window?: unknown }).window
})
