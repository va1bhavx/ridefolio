"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Motorcycle, GarageBike } from "@/types/models"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/feedback/states"
import { distance } from "@/lib/formatters"
import { useOwnership, useOwnershipActions } from "../hooks"
import { GarageForm } from "./garage-form"
export function Garage({
  bikes,
  initialModel,
}: {
  bikes: Motorcycle[]
  initialModel?: string
}) {
  const query = useOwnership(),
    actions = useOwnershipActions(),
    [editing, setEditing] = useState<GarageBike | "new" | null>(
      initialModel ? "new" : null
    ),
    [deleting, setDeleting] = useState<GarageBike | null>(null)
  if (query.isPending) return <LoadingState />
  if (query.isError)
    return (
      <ErrorState
        message={query.error.message}
        retry={() => void query.refetch()}
      />
    )
  return (
    <>
      <PageHeader
        eyebrow="Every motorcycle has a story"
        title="My garage"
        description="Your machines. Your memories. Everything in one place."
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Add motorcycle
          </Button>
        }
      />
      {query.data.garage.length ? (
        <div className="grid gap-7 xl:grid-cols-2">
          {query.data.garage.map((g) => {
            const b = bikes.find((b) => b.id === g.modelId)!
            return (
              <article className="panel overflow-hidden" key={g.id}>
                <div className="relative aspect-[16/8] bg-secondary">
                  <Image
                    src={b.image}
                    alt="Illustrative motorcycle photo, not your exact motorcycle"
                    fill
                    sizes="(max-width:1280px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute right-3 bottom-3 rounded bg-card/95 px-2 py-1 text-xs">
                    Illustrative photo
                  </span>
                </div>
                <div className="p-6">
                  <p className="eyebrow">
                    {b.brand} · {g.year}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">
                    {b.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {g.nickname || g.variant} · {g.variant}
                  </p>
                  <div className="my-6 flex justify-between border-y py-4">
                    <span className="text-sm text-muted-foreground">
                      Current odometer
                    </span>
                    <span className="font-mono">{distance(g.odometer)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      className="link-button"
                      href={`/overview?bike=${g.id}`}
                    >
                      View ownership
                    </Link>
                    <Link
                      className="link-secondary"
                      href={`/motorcycles/${b.id}`}
                    >
                      Specifications
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${b.name}`}
                      onClick={() => setEditing(g)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${b.name}`}
                      onClick={() => setDeleting(g)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Your next chapter starts here"
          description="Add a supported motorcycle to start recording fuel, services and ownership costs."
          action={
            <Button onClick={() => setEditing("new")}>
              Add your first motorcycle
            </Button>
          }
        />
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        Local prototype · Model specifications and images are illustrative.
        Ownership records are saved in this browser.
      </p>
      {editing && (
        <GarageForm
          bikes={bikes}
          existing={editing === "new" ? undefined : editing}
          initialModel={initialModel}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null)
        }}
        title="Remove this motorcycle?"
        description="This also permanently removes its fuel, expense, service and reminder records from this browser. This cannot be undone."
        onConfirm={async () => {
          try {
            if (deleting) await actions.remove("garage", deleting.id)
            toast.success("Motorcycle and its records removed")
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not remove")
            throw e
          }
        }}
      />
    </>
  )
}
