import Image from "next/image"
import Link from "next/link"
import type { Motorcycle } from "@/types/models"
export function MotorcycleCard({ bike }: { bike: Motorcycle }) {
  return (
    <article className="group min-w-0">
      <Link href={`/motorcycles/${bike.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
          <Image
            src={bike.image}
            alt={`Illustrative ${bike.category.toLowerCase()} motorcycling photograph; not the exact model`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-sm bg-card/95 px-2.5 py-1 text-xs">
            {bike.category}
          </span>
          <span className="absolute right-3 bottom-3 rounded-sm bg-card/90 px-2 py-1 text-[11px]">
            Illustrative photo
          </span>
        </div>
        <div className="pt-5">
          <p className="eyebrow text-[11px]">{bike.brand}</p>
          <h3 className="mt-1.5 font-heading text-xl font-semibold">
            {bike.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{bike.tagline}</p>
          <dl className="mt-5 grid grid-cols-3 border-t pt-4">
            {[
              [`${bike.displacement} cc`, "Engine"],
              [`${bike.power} bhp`, "Power"],
              [`${bike.weight} kg`, "Kerb weight"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-xs text-muted-foreground">{l}</dt>
                <dd className="mt-1 font-mono text-sm">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm font-medium text-primary">
            Explore motorcycle
          </p>
        </div>
      </Link>
    </article>
  )
}
