"use client"
import type { Expense, GarageBike, Motorcycle } from "@/types/models"
import { RecordEditor } from "@/components/shared/record-editor"
import { useOwnershipActions } from "@/features/garage"
import { today } from "@/lib/formatters"
import { expenseSchema } from "../schema"
export function ExpenseEditor({
  existing,
  defaultBikeId,
  garage,
  bikes,
  onClose,
}: {
  existing?: Expense
  defaultBikeId?: string
  garage: GarageBike[]
  bikes: Motorcycle[]
  onClose: () => void
}) {
  const actions = useOwnershipActions()
  return (
    <RecordEditor
      title={existing ? "Edit expense" : "Record an expense"}
      description="Fuel and servicing are added automatically from their own records. Log those in Fuel or Service history."
      schema={expenseSchema}
      defaults={
        existing || {
          bikeId: garage.some((g) => g.id === defaultBikeId)
            ? defaultBikeId!
            : garage[0].id,
          date: today(),
          category: "Parts and accessories" as const,
          amount: 0,
          description: "",
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
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["Repairs", "Parts and accessories", "Other"].map((c) => ({
            value: c,
            label: c,
          })),
        },
        { name: "amount", label: "Amount · ₹", type: "number" },
        { name: "description", label: "Description" },
        { name: "notes", label: "Notes (optional)", type: "textarea" },
      ]}
      onClose={onClose}
      onSave={async (v) =>
        actions.save("expenses", {
          ...v,
          id: existing?.id || crypto.randomUUID(),
        })
      }
    />
  )
}
