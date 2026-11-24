"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Motorcycle } from "@/types/models"
import { FilterSelect } from "@/components/shared/fields"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { specificationRows } from "../specifications"
export function MotorcycleDetail({ bike }: { bike: Motorcycle }) {
  const [year, setYear] = useState(String(bike.years.at(-1))),
    [variant, setVariant] = useState(bike.variants[0])
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative min-h-80 overflow-hidden rounded-lg bg-secondary">
          <Image
            src={bike.image}
            alt="Illustrative motorcycling photograph, not this exact model"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded bg-card/95 px-3 py-1 text-xs">
            Illustrative photography · Not the exact model
          </span>
        </div>
        <div className="py-3">
          <p className="eyebrow mb-3">
            {bike.brand} / {bike.category}
          </p>
          <h1 className="page-title md:text-5xl">{bike.name}</h1>
          <p className="mt-4 font-heading text-xl text-muted-foreground">
            {bike.tagline}
          </p>
          <p className="mt-5 leading-7 text-muted-foreground">
            {bike.description}
          </p>
          <div className="my-6 grid grid-cols-2 gap-4">
            <FilterSelect
              label="Model year"
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
          <div className="flex flex-wrap gap-3">
            <Link className="link-button" href={`/garage?model=${bike.id}`}>
              Add to your garage
            </Link>
            <Link className="link-secondary" href={`/compare?first=${bike.id}`}>
              Compare motorcycle
            </Link>
          </div>
        </div>
      </div>
      <p className="my-8 rounded-md border bg-secondary/50 p-4 text-sm text-muted-foreground">
        Demo selection: {year} · {variant}. All listed years and variants share
        an illustrative specification baseline. Verified differences and exact
        schedules are not available in this prototype.
      </p>
      <Tabs defaultValue="overview">
        <div className="overflow-x-auto">
          <TabsList className="mb-6 h-auto min-w-max">
            {[
              "Overview",
              "Specifications",
              "Engine & performance",
              "Technology",
              "Maintenance",
              "Year & variant differences",
            ].map((t, i) => (
              <TabsTrigger value={i === 0 ? "overview" : String(i)} key={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="overview">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="section-title">Get to know the {bike.name}.</h2>
              <p className="reading mt-4">
                {bike.description} Use the specifications as a starting point,
                then explore the guides to understand how the components affect
                your experience.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-6">
              {specificationRows(bike)
                .slice(0, 4)
                .map((s) => (
                  <div key={s.label} className="border-t pt-4">
                    <dt className="text-sm text-muted-foreground">{s.label}</dt>
                    <dd className="mt-2 font-mono text-2xl">{s.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </TabsContent>
        <TabsContent value="1">
          <div className="divide-y rounded-lg border bg-card">
            {specificationRows(bike).map((s) => (
              <div
                key={s.label}
                className="grid gap-3 p-4 md:grid-cols-[1fr_1.5fr]"
              >
                <div>
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-primary">
                      What does this mean?
                    </summary>
                    <p className="mt-2 max-w-sm leading-6 text-muted-foreground">
                      {s.explanation}
                    </p>
                  </details>
                </div>
                <p className="font-mono text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="2">
          <h2 className="section-title">The character beneath the tank.</h2>
          <p className="reading mt-4 max-w-3xl">
            This example pairs a {bike.displacement} cc{" "}
            {bike.engine.toLowerCase()} engine with {bike.cooling.toLowerCase()}{" "}
            and a {bike.transmission.toLowerCase()}. Peak figures of{" "}
            {bike.power} bhp and {bike.torque} Nm are only a starting point:
            gearing, engine speed and weight all influence how it feels.
          </p>
          <Link href="/knowledge/engines" className="link-secondary mt-6">
            Understand power and torque
          </Link>
        </TabsContent>
        <TabsContent value="3">
          <h2 className="section-title">
            Understand the parts that work together.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["cooling", bike.cooling],
              ["braking", bike.brakes],
              ["suspension", bike.suspension],
            ].map(([slug, title]) => (
              <Link
                className="panel p-6"
                href={`/knowledge/${slug}`}
                key={slug}
              >
                <h3 className="font-medium">{title}</h3>
                <p className="mt-3 text-sm text-primary">
                  Read the component guide
                </p>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="4">
          <h2 className="section-title">
            Care begins with the right information.
          </h2>
          <p className="reading mt-4 max-w-3xl">
            No manufacturer-verified schedule is provided for this demo. Consult
            the owner’s manual for your exact model year and variant. General
            checks include tyre condition, lights, visible leaks and chain
            condition where applicable.
          </p>
          <Link className="link-secondary mt-6" href="/knowledge/maintenance">
            Read general maintenance guidance
          </Link>
        </TabsContent>
        <TabsContent value="5">
          <h2 className="section-title">
            A baseline, with the gaps made clear.
          </h2>
          <p className="reading mt-4 max-w-3xl">
            The demo lists {bike.years.join(", ")} and{" "}
            {bike.variants.join(", ")}. It does not assert that engine,
            equipment, colours or dimensions are identical across these
            versions. Year-specific changes await verified catalogue sources.
          </p>
        </TabsContent>
      </Tabs>
    </>
  )
}
