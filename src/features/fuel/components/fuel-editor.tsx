"use client"
import type { FuelEntry, GarageBike, Motorcycle } from "@/types/models"
import { RecordEditor } from "@/components/shared/record-editor"
import { useOwnershipActions } from "@/features/garage"
import { today } from "@/lib/formatters"
import { fuelSchema } from "../schema"
export function FuelEditor({
  existing,
  garage,
  bikes,
  bikeId,
  entries,
  onClose,
}: {
  existing?: FuelEntry
  garage: GarageBike[]
  bikes: Motorcycle[]
  bikeId: string
  entries: FuelEntry[]
  onClose: () => void
}) {
  const actions = useOwnershipActions()
  return (
    <RecordEditor
      title={existing ? "Edit fuel entry" : "A fresh tank. A new chapter."}
      description="Record the amount and quantity from your receipt. Price per litre is calculated automatically."
      schema={fuelSchema}
      defaults={
        existing || {
          bikeId,
          date: today(),
          odometer: garage.find((g) => g.id === bikeId)?.odometer || 0,
          amount: 0,
          litres: 0,
          fullTank: true,
          notes: "",
        }
      }
      fields={[
        {
          name: "bikeId",
          label: "Motorcycle",
          type: "select",
          options: garage.map((g) => ({
            value: g.id,
            label: bikes.find((b) => b.id === g.modelId)!.name,
          })),
        },
        { name: "date", label: "Date", type: "date", max: today() },
        { name: "odometer", label: "Odometer · km", type: "number" },
        { name: "amount", label: "Amount paid · ₹", type: "number" },
        { name: "litres", label: "Fuel quantity · litres", type: "number" },
        {
          name: "fullTank",
          label: "Filled to a full tank",
          type: "checkbox",
          hint: "Only complete full-to-full intervals are used for mileage. Partial refills between them are included.",
        },
        { name: "notes", label: "Notes (optional)", type: "textarea" },
      ]}
      onClose={onClose}
      onSave={async (v) => {
        const others = entries.filter(
          (e) => e.bikeId === v.bikeId && e.id !== existing?.id
        )
        if (others.some((e) => e.odometer === v.odometer))
          throw new Error("A refill already exists at this odometer reading.")
        if (
          others.some(
            (e) =>
              (e.date < v.date && e.odometer > v.odometer) ||
              (e.date > v.date && e.odometer < v.odometer)
          )
        )
          throw new Error(
            "Odometer readings must follow the chronological order of your refills."
          )
        await actions.save("fuel", {
          ...v,
          id: existing?.id || crypto.randomUUID(),
        })
      }}
    />
  )
}
