import Image from "next/image"
import { Brand, ThemeToggle } from "@/components/navigation/public-nav"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="container-wide flex h-20 items-center justify-between">
        <Brand />
        <ThemeToggle />
      </header>
      <main
        id="main-content"
        className="container-wide grid gap-12 py-10 lg:grid-cols-2"
      >
        <div className="relative hidden min-h-[680px] overflow-hidden rounded-lg bg-secondary lg:block">
          <Image
            src="/images/classic.jpg"
            alt="Rider on an open road at sunset"
            loading="eager"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
          <div className="absolute right-10 bottom-12 left-10 text-[var(--hero-foreground)]">
            <p className="text-xs tracking-widest uppercase">
              The next chapter is yours.
            </p>
            <h2 className="mt-4 font-heading text-4xl leading-tight">
              A home for everything
              <br />
              between the rides.
            </h2>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md self-center py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
