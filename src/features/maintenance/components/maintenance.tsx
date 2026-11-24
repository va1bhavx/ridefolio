"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Check } from "lucide-react"
import { toast } from "sonner"
import type { Motorcycle, Reminder } from "@/types/models"
import { useOwnership, useOwnershipActions } from "@/features/garage"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Status } from "@/components/data-display/metrics"
import { OwnershipFilter } from "@/components/shared/ownership-filter"
import { FilterSelect } from "@/components/shared/fields"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/feedback/states"
import { date, distance } from "@/lib/formatters"
import { reminderStatus } from "../calculations"
import { ReminderEditor } from "./reminder-editor"
export function Maintenance({
  bikes,
  initialAdd = false,
  initialBike = "",
}: {
  bikes: Motorcycle[]
  initialAdd?: boolean
  initialBike?: string
}) {
  const query = useOwnership(),
    actions = useOwnershipActions(),
    [bikeId, setBikeId] = useState(initialBike),
    [status, setStatus] = useState(""),
    [editing, setEditing] = useState<Reminder | "new" | null>(
      initialAdd ? "new" : null
    ),
    [deleting, setDeleting] = useState<string | null>(null)
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error.message} />
  const data = query.data,
    entries = data.reminders
      .filter(
        (e) =>
          (!bikeId || e.bikeId === bikeId) &&
          (!status ||
            reminderStatus(
              e,
              data.garage.find((g) => g.id === e.bikeId)?.odometer || 0
            ) === status)
      )
      .sort(
        (a, b) =>
          Number(a.completed) - Number(b.completed) ||
          a.date.localeCompare(b.date)
      )
  return (
    <>
      <PageHeader
        eyebrow="Care for the road ahead"
        title="Maintenance"
        description="Useful reminders. Clear priorities. A motorcycle that feels looked after."
        action={
          <Button
            disabled={!data.garage.length}
            onClick={() => setEditing("new")}
          >
            <Plus className="size-4" />
            Add reminder
          </Button>
        }
      />
      <div className="mb-7 flex flex-wrap items-end gap-4">
        <OwnershipFilter
          garage={data.garage}
          bikes={bikes}
          value={bikeId}
          onChange={setBikeId}
          all
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "", label: "All activities" },
            ...["Overdue", "Due", "Upcoming", "Completed"].map((s) => ({
              value: s,
              label: s,
            })),
          ]}
        />
      </div>
      <div className="mb-7 rounded-lg border bg-secondary/50 p-5">
        <p className="text-sm font-medium">
          Your owner’s manual sets the schedule.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No manufacturer-verified intervals are supplied in this demo. General
          guidance is labelled; personal reminders are user-created. Reminders
          appear inside the app only.
        </p>
        <Link
          href="/knowledge/maintenance"
          className="mt-3 block text-sm text-primary"
        >
          Understand motorcycle maintenance
        </Link>
      </div>
      {entries.length ? (
        <div className="space-y-4">
          {entries.map((e) => {
            const s = reminderStatus(
              e,
              data.garage.find((g) => g.id === e.bikeId)?.odometer || 0
            )
            return (
              <article key={e.id} className="panel p-5 md:p-6">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Status
                        tone={
                          s === "Completed"
                            ? "success"
                            : s === "Upcoming"
                              ? "neutral"
                              : "warning"
                        }
                      >
                        {s}
                      </Status>
                      <Status>{e.source}</Status>
                    </div>
                    <h2 className="text-lg font-medium">{e.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {
                        bikes.find(
                          (b) =>
                            b.id ===
                            data.garage.find((g) => g.id === e.bikeId)?.modelId
                        )?.name
                      }{" "}
                      · {date(e.date)}
                      {e.odometer !== undefined
                        ? ` or ${distance(e.odometer)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await actions.save("reminders", {
                            ...e,
                            completed: !e.completed,
                          })
                          toast.success(
                            e.completed
                              ? "Reminder reopened"
                              : "Marked complete"
                          )
                        } catch {
                          toast.error("Could not update reminder")
                        }
                      }}
                    >
                      <Check className="size-4" />
                      {e.completed ? "Reopen" : "Mark complete"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${e.title}`}
                      onClick={() => setEditing(e)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${e.title}`}
                      onClick={() => setDeleting(e.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {e.notes && (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {e.notes}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Nothing needs attention in this view"
          description="Try another filter or create your own reminder."
          action={
            !data.garage.length ? (
              <Link href="/garage" className="link-button">
                Add a motorcycle
              </Link>
            ) : undefined
          }
        />
      )}
      <p className="mt-7 text-xs text-muted-foreground">
        Date and odometer thresholds use whichever is reached first. Completing
        a reminder does not create a service record.
      </p>
      {editing && data.garage.length > 0 && (
        <ReminderEditor
          existing={editing === "new" ? undefined : editing}
          defaultBikeId={bikeId}
          garage={data.garage}
          bikes={bikes}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null)
        }}
        title="Remove this reminder?"
        description="This reminder will be deleted from your local garage."
        onConfirm={async () => {
          try {
            await actions.remove("reminders", deleting!)
            toast.success("Reminder removed")
          } catch (e) {
            toast.error("Could not remove reminder")
            throw e
          }
        }}
      />
    </>
  )
}
