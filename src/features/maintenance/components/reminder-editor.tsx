"use client"
import type { Reminder, GarageBike, Motorcycle } from "@/types/models"
import { RecordEditor } from "@/components/shared/record-editor"
import { useOwnershipActions } from "@/features/garage"
import { today } from "@/lib/formatters"
import { reminderSchema } from "../schema"
export function ReminderEditor({
  existing,
  defaultBikeId,
  garage,
  bikes,
  onClose,
}: {
  existing?: Reminder
  defaultBikeId?: string
  garage: GarageBike[]
  bikes: Motorcycle[]
  onClose: () => void
}) {
  const actions = useOwnershipActions()
  return (
    <RecordEditor
      title={existing ? "Edit reminder" : "A little care, remembered"}
      description="This is a personal reminder, not a manufacturer service interval. It becomes due when either threshold is reached."
      schema={reminderSchema}
      defaults={
        existing
          ? {
              ...existing,
              odometer:
                existing.odometer === undefined
                  ? ""
                  : String(existing.odometer),
            }
          : {
              bikeId: garage.some((g) => g.id === defaultBikeId)
                ? defaultBikeId!
                : garage[0].id,
              title: "",
              date: today(),
              odometer: "",
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
        { name: "title", label: "What needs attention?" },
        { name: "date", label: "Due date", type: "date" },
        {
          name: "odometer",
          label: "Due odometer · km (optional)",
          hint: "Absolute reading, for example 10,000 km.",
        },
        { name: "notes", label: "Notes (optional)", type: "textarea" },
      ]}
      onClose={onClose}
      onSave={async (v) =>
        actions.save("reminders", {
          ...v,
          odometer: v.odometer === "" ? undefined : Number(v.odometer),
          id: existing?.id || crypto.randomUUID(),
          completed: existing?.completed || false,
          source: "User-created",
        })
      }
    />
  )
}
