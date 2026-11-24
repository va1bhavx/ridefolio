"use client"
import { useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import type { Article } from "@/types/models"
import { SearchInput, FilterSelect } from "@/components/shared/fields"
import { EmptyState } from "@/components/feedback/states"
export function KnowledgeBrowser({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("")
  const matches = articles.filter(
    (a) =>
      `${a.title} ${a.intro} ${a.category}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!category || a.category === category)
  )
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="What would you like to understand?"
        />
        <FilterSelect
          label="Topic"
          value={category}
          onChange={setCategory}
          options={[
            { value: "", label: "All topics" },
            ...articles.map((a) => ({ value: a.category, label: a.category })),
          ]}
        />
      </div>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        {matches.length} guides · General education
      </p>
      {matches.length ? (
        <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((a) => (
            <Link
              href={`/knowledge/${a.slug}`}
              key={a.slug}
              className="border-t py-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <BookOpen className="size-5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {a.minutes} min read
                </span>
              </div>
              <p className="eyebrow">{a.category}</p>
              <h2 className="mt-3 font-heading text-xl font-semibold">
                {a.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {a.intro}
              </p>
              <p className="mt-5 text-sm font-medium text-primary">
                Read the guide
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No guides found"
          description="Try a broader topic such as engine, tyres or maintenance."
        />
      )}
    </>
  )
}
