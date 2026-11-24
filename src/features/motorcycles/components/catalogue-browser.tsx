"use client"
import { useState } from "react"
import type { Motorcycle } from "@/types/models"
import { SearchInput, FilterSelect } from "@/components/shared/fields"
import { MotorcycleCard } from "./motorcycle-card"
import { EmptyState } from "@/components/feedback/states"
import { Button } from "@/components/ui/button"
export function CatalogueBrowser({
  motorcycles,
  initialBrand = "",
}: {
  motorcycles: Motorcycle[]
  initialBrand?: string
}) {
  const [search, setSearch] = useState(""),
    [brand, setBrand] = useState(initialBrand),
    [year, setYear] = useState(""),
    [category, setCategory] = useState("")
  const bikes = motorcycles.filter(
    (b) =>
      `${b.brand} ${b.name}`.toLowerCase().includes(search.toLowerCase()) &&
      (!brand || b.brand === brand) &&
      (!year || b.years.includes(Number(year))) &&
      (!category || b.category === category)
  )
  const options = (values: string[], all: string) => [
    { value: "", label: all },
    ...values.map((v) => ({ value: v, label: v })),
  ]
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border bg-secondary/40 p-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Find your motorcycle…"
        />
        <FilterSelect
          label="Manufacturer"
          value={brand}
          onChange={setBrand}
          options={options(
            [...new Set(motorcycles.map((b) => b.brand))],
            "All manufacturers"
          )}
        />
        <FilterSelect
          label="Model year"
          value={year}
          onChange={setYear}
          options={options(
            ["2025", "2024", "2023", "2022", "2021"],
            "All years"
          )}
        />
        <FilterSelect
          label="Riding style"
          value={category}
          onChange={setCategory}
          options={options(
            [...new Set(motorcycles.map((b) => b.category))],
            "All styles"
          )}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("")
            setBrand("")
            setYear("")
            setCategory("")
          }}
        >
          Reset
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {bikes.length} motorcycles · Demonstration catalogue
      </p>
      {bikes.length ? (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((b) => (
            <MotorcycleCard key={b.id} bike={b} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No motorcycles found"
          description="Try another name, manufacturer or model year."
        />
      )}
    </>
  )
}
