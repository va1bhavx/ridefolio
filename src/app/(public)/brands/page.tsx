import Link from "next/link"
import { catalogue } from "@/services/catalogue"
import { PageHeader } from "@/components/shared/page-header"
export const metadata = { title: "Manufacturers" }
export default async function Page() {
  const bikes = await catalogue.list()
  const brands = [...new Set(bikes.map((b) => b.brand))]
  return (
    <div className="container-wide section-space">
      <PageHeader
        eyebrow="Different philosophies. Shared passion."
        title="Meet the manufacturers."
        description="Explore the brands in our ten-model demonstration catalogue."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            href={`/motorcycles?brand=${encodeURIComponent(brand)}`}
            key={brand}
            className="panel p-8 transition-colors hover:border-primary"
          >
            <span className="font-heading text-2xl font-semibold">{brand}</span>
            <p className="mt-3 text-sm text-muted-foreground">
              {bikes
                .filter((b) => b.brand === brand)
                .map((b) => b.name)
                .join(" · ")}
            </p>
            <p className="mt-7 text-sm text-primary">Explore models</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
