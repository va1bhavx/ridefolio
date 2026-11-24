"use client"
import type { GarageBike, Motorcycle } from "@/types/models"
import { FilterSelect } from "./fields"
export function OwnershipFilter({
  garage,
  bikes,
  value,
  onChange,
  all = false,
}: {
  garage: GarageBike[]
  bikes: Motorcycle[]
  value: string
  onChange: (v: string) => void
  all?: boolean
}) {
  return (
    <FilterSelect
      label="Motorcycle"
      value={value}
      onChange={onChange}
      options={[
        ...(all ? [{ value: "", label: "All motorcycles" }] : []),
        ...garage.map((g) => ({
          value: g.id,
          label: `${bikes.find((b) => b.id === g.modelId)?.name || "Motorcycle"} · ${g.nickname || g.year}`,
        })),
      ]}
    />
  )
}
