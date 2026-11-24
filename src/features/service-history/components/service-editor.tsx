"use client"
import type { ServiceRecord, GarageBike, Motorcycle } from "@/types/models"
import { RecordEditor } from "@/components/shared/record-editor"
import { useOwnershipActions } from "@/features/garage"
import { today } from "@/lib/formatters"
import { serviceSchema } from "../schema"
export function ServiceEditor({
  existing,
  defaultBikeId,
  garage,
  bikes,
  onClose,
}: {
  existing?: ServiceRecord
  defaultBikeId?: string
  garage: GarageBike[]
  bikes: Motorcycle[]
  onClose: () => void
}) {
  const actions = useOwnershipActions()
  return (
    <RecordEditor
      title={existing ? "Edit service record" : "Keep this chapter on record"}
      description="Service cost appears automatically in Expenses. Include all work and parts in a single total."
      schema={serviceSchema}
      defaults={
        existing || {
          bikeId: garage.some((g) => g.id === defaultBikeId)
            ? defaultBikeId!
            : garage[0].id,
          date: today(),
          odometer: (garage.find((g) => g.id === defaultBikeId) || garage[0])
            .odometer,
          work: "",
          parts: "",
          centre: "",
          amount: 0,
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
        { name: "date", label: "Service date", type: "date", max: today() },
        { name: "odometer", label: "Odometer · km", type: "number" },
        { name: "amount", label: "Total cost · ₹", type: "number" },
        { name: "centre", label: "Garage / service centre" },
        { name: "parts", label: "Parts replaced (optional)" },
        { name: "work", label: "Work performed", type: "textarea" },
        { name: "notes", label: "Notes (optional)", type: "textarea" },
      ]}
      onClose={onClose}
      onSave={async (v) =>
        actions.save("services", {
          ...v,
          id: existing?.id || crypto.randomUUID(),
        })
      }
    />
  )
}
