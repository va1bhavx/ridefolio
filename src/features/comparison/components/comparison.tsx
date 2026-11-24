"use client"
import { useState } from "react"
import Link from "next/link"
import type { Motorcycle } from "@/types/models"
import { FilterSelect } from "@/components/shared/fields"
import { numericSpecs } from "@/features/motorcycles"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
function Choice({
  bikes,
  value,
  onChange,
}: {
  bikes: Motorcycle[]
  value: string
  onChange: (v: string) => void
}) {
  const bike = bikes.find((b) => b.id === value)!
  const [year, setYear] = useState(String(bike.years.at(-1))),
    [variant, setVariant] = useState(bike.variants[0])
  return (
    <div className="panel p-5">
      <FilterSelect
        label="Motorcycle"
        value={value}
        onChange={onChange}
        options={bikes.map((b) => ({
          value: b.id,
          label: `${b.brand} ${b.name}`,
        }))}
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <FilterSelect
          label="Year"
          value={year}
          onChange={setYear}
          options={bike.years.map((y) => ({
            value: String(y),
            label: String(y),
          }))}
        />
        <FilterSelect
          label="Variant"
          value={variant}
          onChange={setVariant}
          options={bike.variants.map((v) => ({ value: v, label: v }))}
        />
      </div>
      <Link
        className="mt-4 block text-sm text-primary"
        href={`/motorcycles/${bike.id}`}
      >
        View motorcycle
      </Link>
    </div>
  )
}
export function Comparison({
  bikes,
  initialFirst,
}: {
  bikes: Motorcycle[]
  initialFirst?: string
}) {
  const [first, setFirst] = useState(
      bikes.some((b) => b.id === initialFirst) ? initialFirst! : bikes[0].id
    ),
    [second, setSecond] = useState(bikes[1].id)
  const a = bikes.find((b) => b.id === first)!,
    b = bikes.find((b) => b.id === second)!
  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Choice
          key={`a-${first}`}
          bikes={bikes}
          value={first}
          onChange={setFirst}
        />
        <Choice
          key={`b-${second}`}
          bikes={bikes}
          value={second}
          onChange={setSecond}
        />
      </div>
      {first === second && (
        <p role="status" className="mb-4 text-warning">
          You’re comparing the same model. Choose another to see differences.
        </p>
      )}
      <p className="mb-6 text-sm text-muted-foreground">
        Illustrative baseline values apply to all selectable years and variants.
        Higher or lower is a difference, not a verdict.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[650px]">
          <TableHeader>
            <TableRow>
              <TableHead>Specification</TableHead>
              <TableHead>{a.name}</TableHead>
              <TableHead>{b.name}</TableHead>
              <TableHead>Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numericSpecs.map((s) => (
              <TableRow key={s.key}>
                <TableCell>
                  <details>
                    <summary className="cursor-pointer font-medium">
                      {s.label}
                    </summary>
                    <p className="max-w-64 py-3 text-xs leading-5 text-muted-foreground">
                      {s.explanation}
                    </p>
                  </details>
                </TableCell>
                <TableCell className="font-mono">
                  {a[s.key]} {s.unit}
                </TableCell>
                <TableCell className="font-mono">
                  {b[s.key]} {s.unit}
                </TableCell>
                <TableCell className="text-xs text-primary">
                  {a[s.key] === b[s.key]
                    ? "Same"
                    : `${a.name}: ${Math.abs(a[s.key] - b[s.key])
                        .toFixed(1)
                        .replace(
                          /\.0$/,
                          ""
                        )} ${s.unit} ${a[s.key] > b[s.key] ? "higher" : "lower"}`}
                </TableCell>
              </TableRow>
            ))}
            {[
              ["Cooling", a.cooling, b.cooling],
              ["Transmission", a.transmission, b.transmission],
              ["Brakes", a.brakes, b.brakes],
            ].map(([l, x, y]) => (
              <TableRow key={l}>
                <TableCell>{l}</TableCell>
                <TableCell>{x}</TableCell>
                <TableCell>{y}</TableCell>
                <TableCell>
                  {x === y ? "Same baseline" : "Different systems"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">
            Power is part of the picture.
          </h2>
          <p className="reading mt-2">
            Peak output alone cannot describe acceleration, comfort or
            rideability. Weight, gearing, engine character and rider fit matter
            together.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            Understand before you decide.
          </h2>
          <p className="reading mt-2">
            Compare the riding position and intended use alongside the figures.
            Verify current specifications with the manufacturer.
          </p>
          <Link href="/knowledge/engines" className="text-sm text-primary">
            Learn about engine performance
          </Link>
        </div>
      </div>
    </>
  )
}
