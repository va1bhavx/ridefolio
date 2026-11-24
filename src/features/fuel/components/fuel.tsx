"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Motorcycle, FuelEntry } from "@/types/models"
import { useOwnership, useOwnershipActions } from "@/features/garage"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Metrics, Status } from "@/components/data-display/metrics"
import { OwnershipFilter } from "@/components/shared/ownership-filter"
import { DateRange } from "@/components/shared/fields"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/feedback/states"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  currency,
  date,
  distance,
  litres,
  mileage,
  number,
} from "@/lib/formatters"
import { fuelSummary } from "../calculations"
import { FuelEditor } from "./fuel-editor"
export function Fuel({
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
    [selected, setSelected] = useState(initialBike),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [editing, setEditing] = useState<FuelEntry | "new" | null>(
      initialAdd ? "new" : null
    ),
    [deleting, setDeleting] = useState<string | null>(null)
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error.message} />
  const data = query.data,
    bikeId = selected || data.garage[0]?.id || "",
    entries = data.fuel
      .filter(
        (e) =>
          e.bikeId === bikeId &&
          (!from || e.date >= from) &&
          (!to || e.date <= to)
      )
      .sort((a, b) => b.odometer - a.odometer),
    summary = fuelSummary(entries)
  return (
    <>
      <PageHeader
        eyebrow="Every refill tells you something"
        title="Fuel & mileage"
        description="Know what goes in. Understand what you get out."
        action={
          <Button
            disabled={!data.garage.length}
            onClick={() => setEditing("new")}
          >
            <Plus className="size-4" />
            Add fuel
          </Button>
        }
      />
      {!data.garage.length ? (
        <EmptyState
          title="Add a motorcycle first"
          description="Fuel records belong to a motorcycle in your garage."
          action={
            <Link href="/garage" className="link-button">
              Open garage
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-7 flex flex-wrap items-end gap-4">
            <OwnershipFilter
              garage={data.garage}
              bikes={bikes}
              value={bikeId}
              onChange={setSelected}
            />
            <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
          </div>
          <Metrics
            items={[
              { label: "Fuel expenditure", value: currency(summary.amount) },
              { label: "Fuel recorded", value: litres(summary.litres) },
              {
                label: "Measured mileage",
                value: mileage(summary.mileage),
                note: `${summary.intervals} complete full-tank intervals`,
              },
              {
                label: "Refills",
                value: String(entries.length),
                note: "In selected period",
              },
            ]}
          />
          <p className="mb-6 rounded border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
            {summary.intervals
              ? "Mileage uses the distance between full tanks divided by every litre added between them. The starting tank’s fuel is excluded. Results depend on consistent fill levels and complete records."
              : "Not enough complete full-tank intervals in this period. Record two full tanks, including every partial refill between them, to calculate meaningful mileage."}
          </p>
          {entries.length ? (
            <div className="overflow-x-auto rounded-lg border bg-card">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    {[
                      "Date",
                      "Odometer",
                      "Quantity",
                      "Price / litre",
                      "Amount",
                      "Tank",
                      "Actions",
                    ].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        {date(e.date)}
                        {e.notes && (
                          <p
                            className="mt-1 max-w-48 truncate text-xs text-muted-foreground"
                            title={e.notes}
                          >
                            {e.notes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">
                        {distance(e.odometer)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {litres(e.litres)}
                      </TableCell>
                      <TableCell className="font-mono">
                        ₹{number(e.amount / e.litres, 2)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {currency(e.amount)}
                      </TableCell>
                      <TableCell>
                        <Status tone={e.fullTank ? "success" : "neutral"}>
                          {e.fullTank ? "Full" : "Partial"}
                        </Status>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit refill on ${e.date}`}
                          onClick={() => setEditing(e)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete refill on ${e.date}`}
                          onClick={() => setDeleting(e.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="No refills in this view"
              description="Add your first refill or adjust the date range."
            />
          )}
        </>
      )}
      {editing && data.garage.length > 0 && (
        <FuelEditor
          existing={editing === "new" ? undefined : editing}
          garage={data.garage}
          bikes={bikes}
          bikeId={bikeId}
          entries={data.fuel}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null)
        }}
        title="Delete this refill?"
        description="Mileage and expenditure will be recalculated. If this leaves an unrecorded refill, the remaining mileage result may be unreliable."
        onConfirm={async () => {
          try {
            await actions.remove("fuel", deleting!)
            toast.success("Refill removed")
          } catch (e) {
            toast.error("Could not remove refill")
            throw e
          }
        }}
      />
    </>
  )
}
