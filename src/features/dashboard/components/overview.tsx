"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Fuel, Wallet, Wrench, CalendarPlus, BookOpen } from "lucide-react"
import type { Motorcycle } from "@/types/models"
import { useOwnership } from "@/features/garage"
import { PageHeader } from "@/components/shared/page-header"
import { Metrics, Status } from "@/components/data-display/metrics"
import { OwnershipFilter } from "@/components/shared/ownership-filter"
import {
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/feedback/states"
import { currency, date, distance, mileage } from "@/lib/formatters"
import { fuelSummary } from "@/features/fuel"
import { expenseSummary } from "@/features/expenses"
import { reminderStatus } from "@/features/maintenance"
export function Overview({
  bikes,
  initialBike,
}: {
  bikes: Motorcycle[]
  initialBike?: string
}) {
  const query = useOwnership(),
    [selected, setSelected] = useState(initialBike || "")
  if (query.isPending) return <LoadingState />
  if (query.isError)
    return (
      <ErrorState
        message={query.error.message}
        retry={() => void query.refetch()}
      />
    )
  const data = query.data,
    g = data.garage.find((g) => g.id === selected) || data.garage[0]
  if (!g)
    return (
      <>
        <PageHeader
          eyebrow="A new chapter"
          title={`Welcome, ${data.preferences.name.split(" ")[0]}.`}
          description="Let’s give your motorcycle a home."
        />
        <EmptyState
          title="Your garage is ready for its first ride"
          description="Choose a supported motorcycle to start tracking fuel, services and ownership costs."
          action={
            <Link href="/garage" className="link-button">
              Add your motorcycle
            </Link>
          }
        />
      </>
    )
  const bike = bikes.find((b) => b.id === g.modelId)!,
    fuel = data.fuel
      .filter((e) => e.bikeId === g.id)
      .sort((a, b) => b.date.localeCompare(a.date)),
    fuelStats = fuelSummary(fuel),
    spend = expenseSummary(data, g.id),
    service = data.services
      .filter((e) => e.bikeId === g.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0],
    reminders = data.reminders
      .filter((e) => e.bikeId === g.id && !e.completed)
      .sort((a, b) => a.date.localeCompare(b.date))
  return (
    <>
      <PageHeader
        eyebrow="Your ownership, at a glance"
        title={`Good to see you, ${data.preferences.name.split(" ")[0]}.`}
        description="A little clarity before your next ride."
        action={
          <OwnershipFilter
            garage={data.garage}
            bikes={bikes}
            value={g.id}
            onChange={setSelected}
          />
        }
      />
      <div className="mb-8 grid overflow-hidden rounded-lg border bg-card md:grid-cols-[1fr_300px]">
        <div className="p-6 md:p-8">
          <p className="eyebrow">
            {bike.brand} · {g.year} · {g.variant}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold">
            {bike.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {g.nickname || bike.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <Link href={`/motorcycles/${bike.id}`} className="text-primary">
              Explore your motorcycle
            </Link>
            <Link href="/garage" className="text-muted-foreground">
              Manage garage
            </Link>
          </div>
        </div>
        <div className="relative min-h-48">
          <Image
            src={bike.image}
            alt="Illustrative motorcycle photograph"
            loading="eager"
            fill
            sizes="(max-width:768px) 100vw, 300px"
            className="object-cover"
          />
          <span className="absolute right-3 bottom-3 rounded bg-card/90 px-2 py-1 text-[11px]">
            Illustrative photo
          </span>
        </div>
      </div>
      <Metrics
        items={[
          { label: "Current odometer", value: distance(g.odometer) },
          {
            label: "Recorded ownership cost",
            value: currency(spend.total),
            note: "All recorded fuel, services & expenses",
          },
          { label: "Fuel expenditure", value: currency(fuelStats.amount) },
          {
            label: "Measured mileage",
            value: mileage(fuelStats.mileage),
            note: `${fuelStats.intervals} full-tank intervals`,
          },
        ]}
      />
      <div className="mb-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { href: "/fuel?add=1", label: "Add fuel", icon: Fuel },
          { href: "/expenses?add=1", label: "Add expense", icon: Wallet },
          {
            href: "/service-history?add=1",
            label: "Record service",
            icon: Wrench,
          },
          {
            href: "/maintenance?add=1",
            label: "Add reminder",
            icon: CalendarPlus,
          },
        ].map((a) => (
          <Link
            key={a.href}
            href={`${a.href}&bike=${g.id}`}
            className="flex items-center gap-3 rounded-md border bg-card p-4 text-sm font-medium hover:border-primary"
          >
            <a.icon className="size-5 text-primary" />
            {a.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent ownership activity</h2>
            <Link href="/expenses" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="panel divide-y">
            {spend.entries.length ? (
              spend.entries.slice(0, 5).map((e) => (
                <Link
                  href={
                    e.origin === "fuel"
                      ? "/fuel"
                      : e.origin === "services"
                        ? "/service-history"
                        : "/expenses"
                  }
                  key={`${e.origin}-${e.id}`}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="line-clamp-1 text-sm font-medium">
                      {e.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {date(e.date)} · {e.category}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm">
                    {currency(e.amount)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="p-6 text-sm text-muted-foreground">
                Your next record starts the story.
              </p>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="panel p-5">
              <p className="text-xs text-muted-foreground">LATEST FUEL ENTRY</p>
              <p className="mt-3 font-medium">
                {fuel[0]
                  ? `${currency(fuel[0].amount)} · ${fuel[0].litres} litres`
                  : "No refill recorded"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {fuel[0]
                  ? date(fuel[0].date)
                  : "Add a fuel entry to get started."}
              </p>
            </div>
            <div className="panel p-5">
              <p className="text-xs text-muted-foreground">LATEST SERVICE</p>
              <p className="mt-3 text-sm font-medium">
                {service?.centre || "No service recorded"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {service
                  ? `${date(service.date)} · ${distance(service.odometer)}`
                  : "Keep your next service on record."}
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">A little attention</h2>
            <Link href="/maintenance" className="text-sm text-primary">
              All reminders
            </Link>
          </div>
          <div className="panel divide-y">
            {!data.preferences.reminders ? (
              <p className="p-6 text-sm text-muted-foreground">
                Dashboard reminders are hidden in your preferences. All
                activities remain available in Maintenance.
              </p>
            ) : reminders.length ? (
              reminders.slice(0, 3).map((r) => (
                <Link href="/maintenance" key={r.id} className="block p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {date(r.date)}
                    </span>
                    <Status
                      tone={
                        reminderStatus(r, g.odometer) === "Upcoming"
                          ? "neutral"
                          : "warning"
                      }
                    >
                      {reminderStatus(r, g.odometer)}
                    </Status>
                  </div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {r.source}
                  </p>
                </Link>
              ))
            ) : (
              <p className="p-6 text-sm text-muted-foreground">
                No open reminders. Enjoy the next ride.
              </p>
            )}
          </div>
          <Link
            href="/knowledge/maintenance"
            className="mt-6 flex gap-4 rounded-lg bg-secondary p-6"
          >
            <BookOpen className="size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Get to know your motorcycle better.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Simple checks. More informed ownership. Explore the maintenance
                guide.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </>
  )
}
