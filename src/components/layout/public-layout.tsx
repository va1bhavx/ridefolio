import Link from "next/link"
import { PublicNav, Brand } from "@/components/navigation/public-nav"
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main id="main-content">{children}</main>
      <footer className="border-t bg-card">
        <div className="container-wide grid gap-8 py-12 md:grid-cols-2">
          <div>
            <Brand />
            <p className="mt-4 text-sm text-muted-foreground">
              Understand your ride. Own its story.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Made for the love of motorcycling.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap content-start gap-x-8 gap-y-4 text-sm md:justify-end"
          >
            {[
              ["/motorcycles", "Motorcycles"],
              ["/knowledge", "Knowledge"],
              ["/compare", "Compare"],
              ["/overview", "My garage"],
              ["/feedback", "Feedback"],
            ].map(([h, l]) => (
              <Link href={h} key={h}>
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <div className="container-wide flex flex-wrap justify-between gap-3 border-t py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Ridefolio · MVP-0</span>
          <span>
            Interactive demo · Illustrative specifications & imagery · Local
            data only
          </span>
        </div>
      </footer>
    </>
  )
}
