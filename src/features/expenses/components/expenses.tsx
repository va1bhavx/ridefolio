"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Motorcycle, Expense } from "@/types/models"
import { useOwnership, useOwnershipActions } from "@/features/garage"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Metrics, Status } from "@/components/data-display/metrics"
import { OwnershipFilter } from "@/components/shared/ownership-filter"
import { DateRange, FilterSelect } from "@/components/shared/fields"
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
import { currency, date } from "@/lib/formatters"
import { expenseSummary } from "../calculations"
import { ExpenseEditor } from "./expense-editor"
import { ExpenseChart } from "./expense-chart"
export function Expenses({
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
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [category, setCategory] = useState(""),
    [editing, setEditing] = useState<Expense | "new" | null>(
      initialAdd ? "new" : null
    ),
    [deleting, setDeleting] = useState<string | null>(null)
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error.message} />
  const data = query.data,
    summary = expenseSummary(data, bikeId, from, to || undefined),
    entries = summary.entries.filter(
      (e) => !category || e.category === category
    )
  return (
    <>
      <PageHeader
        eyebrow="The cost of the journey"
        title="Expenses"
        description="A clear view of ownership, with every rupee counted once."
        action={
          <Button
            disabled={!data.garage.length}
            onClick={() => setEditing("new")}
          >
            <Plus className="size-4" />
            Add expense
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
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <FilterSelect
          label="History category"
          value={category}
          onChange={setCategory}
          options={[
            { value: "", label: "All categories" },
            ...summary.categories.map((c) => ({
              value: c.name,
              label: c.name,
            })),
          ]}
        />
      </div>
      <Metrics
        items={[
          { label: "Total recorded", value: currency(summary.total) },
          { label: "Fuel", value: currency(summary.categories[0].amount) },
          { label: "Servicing", value: currency(summary.categories[1].amount) },
          {
            label: "Other ownership costs",
            value: currency(
              summary.total -
                summary.categories[0].amount -
                summary.categories[1].amount
            ),
          },
        ]}
      />
      {summary.total > 0 && <ExpenseChart categories={summary.categories} />}
      <p className="mb-5 text-sm leading-6 text-muted-foreground">
        Totals and chart reflect the selected motorcycle and period. Category
        filters the history below. Fuel and service entries are linked
        automatically; edit them in their original sections.
      </p>
      {entries.length ? (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table className="min-w-[650px]">
            <TableHeader>
              <TableRow>
                {["Date", "Description", "Category", "Amount", "Actions"].map(
                  (h) => (
                    <TableHead key={h}>{h}</TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={`${e.origin}-${e.id}`}>
                  <TableCell>{date(e.date)}</TableCell>
                  <TableCell className="max-w-64 whitespace-normal">
                    {e.description}
                  </TableCell>
                  <TableCell>
                    <Status>{e.category}</Status>
                  </TableCell>
                  <TableCell className="font-mono">
                    {currency(e.amount)}
                  </TableCell>
                  <TableCell>
                    {e.origin === "expenses" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${e.description}`}
                          onClick={() =>
                            setEditing(
                              data.expenses.find((x) => x.id === e.id)!
                            )
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${e.description}`}
                          onClick={() => setDeleting(e.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <Link
                        className="text-sm text-primary"
                        href={
                          e.origin === "fuel" ? "/fuel" : "/service-history"
                        }
                      >
                        View original
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="No expenses in this view"
          description="Adjust your filters or record an ownership expense. Add a motorcycle first if your garage is empty."
          action={
            !data.garage.length ? (
              <Link className="link-button" href="/garage">
                Open garage
              </Link>
            ) : undefined
          }
        />
      )}
      <div className="mt-6 flex gap-5 text-sm text-primary">
        <Link href="/fuel?add=1">Record fuel</Link>
        <Link href="/service-history?add=1">Record a service</Link>
      </div>
      {editing && data.garage.length > 0 && (
        <ExpenseEditor
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
        title="Delete this expense?"
        description="This removes the expense from your local history and updates your totals."
        onConfirm={async () => {
          try {
            await actions.remove("expenses", deleting!)
            toast.success("Expense removed")
          } catch (e) {
            toast.error("Could not remove expense")
            throw e
          }
        }}
      />
    </>
  )
}
