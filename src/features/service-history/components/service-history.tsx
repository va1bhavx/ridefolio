"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Wrench } from "lucide-react"
import { toast } from "sonner"
import type { Motorcycle, ServiceRecord } from "@/types/models"
import { useOwnership, useOwnershipActions } from "@/features/garage"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { OwnershipFilter } from "@/components/shared/ownership-filter"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/feedback/states"
import { currency, date, distance } from "@/lib/formatters"
import { ServiceEditor } from "./service-editor"
export function ServiceHistory({
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
    [editing, setEditing] = useState<ServiceRecord | "new" | null>(
      initialAdd ? "new" : null
    ),
    [deleting, setDeleting] = useState<string | null>(null)
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error.message} />
  const data = query.data,
    entries = data.services
      .filter((e) => !bikeId || e.bikeId === bikeId)
      .sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader
        eyebrow="Care worth keeping"
        title="Service history"
        description="A lasting record of the work that keeps you moving."
        action={
          <Button
            disabled={!data.garage.length}
            onClick={() => setEditing("new")}
          >
            <Plus className="size-4" />
            Record service
          </Button>
        }
      />
      <div className="mb-8 max-w-sm">
        <OwnershipFilter
          garage={data.garage}
          bikes={bikes}
          value={bikeId}
          onChange={setBikeId}
          all
        />
      </div>
      {entries.length ? (
        <ol className="ml-3 space-y-8 border-l pl-7">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute top-5 -left-[39px] flex size-6 items-center justify-center rounded-full border bg-background">
                <Wrench className="size-3 text-primary" />
              </span>
              <article className="panel p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {date(e.date)} · {distance(e.odometer)} ·{" "}
                      {
                        bikes.find(
                          (b) =>
                            b.id ===
                            data.garage.find((g) => g.id === e.bikeId)?.modelId
                        )?.name
                      }
                    </p>
                    <h2 className="mt-3 text-lg font-semibold">{e.work}</h2>
                    <p className="mt-2 text-sm text-primary">{e.centre}</p>
                  </div>
                  <span className="font-mono text-xl">
                    {currency(e.amount)}
                  </span>
                </div>
                {e.parts && (
                  <p className="mt-5 border-t pt-4 text-sm">
                    <span className="text-muted-foreground">
                      Parts replaced:{" "}
                    </span>
                    {e.parts}
                  </p>
                )}
                {e.notes && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {e.notes}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(e)}>
                    <Pencil className="size-4" />
                    Edit record
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label={`Delete service from ${e.date}`}
                    onClick={() => setDeleting(e.id)}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          title="A fresh service history"
          description="Record your first service to keep work, parts and costs together."
          action={
            !data.garage.length ? (
              <Link className="link-button" href="/garage">
                Add a motorcycle
              </Link>
            ) : undefined
          }
        />
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        Service costs are included once in your ownership expenditure. Records
        are entered by the rider, not verified by a workshop.
      </p>
      {editing && data.garage.length > 0 && (
        <ServiceEditor
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
        title="Delete this service record?"
        description="The service and its linked expenditure will be removed from your local history."
        onConfirm={async () => {
          try {
            await actions.remove("services", deleting!)
            toast.success("Service removed")
          } catch (e) {
            toast.error("Could not remove service")
            throw e
          }
        }}
      />
    </>
  )
}
