import Image from "next/image"
import Link from "next/link"
import { BookOpen, Fuel, Wrench, Compass, Check } from "lucide-react"
import { catalogue } from "@/services/catalogue"
import { MotorcycleCard } from "@/features/motorcycles"
import { demoPreview } from "@/features/dashboard"
export default async function Home() {
  const bikes = (await catalogue.list()).slice(0, 3)
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--hero)] text-[var(--hero-foreground)]">
        <div className="container-wide relative grid min-h-[620px] lg:grid-cols-[.95fr_1.05fr]">
          <div className="relative z-10 flex flex-col justify-center py-16 lg:py-24 lg:pr-10">
            <p className="mb-7 text-xs font-medium tracking-[.2em] text-[var(--hero-muted)] uppercase">
              For the rider. And the road ahead.
            </p>
            <h1 className="max-w-xl font-heading text-5xl leading-[1.12] font-medium tracking-[-.045em] sm:text-6xl xl:text-7xl">
              Understand
              <br />
              your ride.
              <br />
              <span className="text-[var(--hero-muted)]">Own its story.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[var(--hero-muted)]">
              From the first spark of curiosity to the thousandth kilometre.
              Discover motorcycles and keep every chapter of ownership in one
              place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/motorcycles"
                className="link-button bg-[var(--hero-foreground)] text-[var(--hero)] hover:bg-[var(--hero-muted)]"
              >
                Explore motorcycles
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center rounded-md border border-[var(--hero-muted)]/40 px-5 text-sm"
              >
                Start your garage
              </Link>
            </div>
            <p className="mt-9 flex items-center gap-2 text-xs text-[var(--hero-muted)]">
              <span className="h-px w-6 bg-gold" />
              Built for riders. Made for the long run.
            </p>
          </div>
          <div className="relative -mx-5 min-h-80 md:-mx-10 lg:mx-0 lg:mr-[-4rem]">
            <Image
              src="/images/classic.jpg"
              alt="A motorcyclist enjoying an open road at sunset"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-[48%_center]"
            />
            <div className="absolute inset-0 bg-[var(--hero-overlay)] opacity-20" />
            <div className="absolute right-6 bottom-7 left-6 flex justify-between border-t border-[var(--hero-foreground)]/40 pt-4 text-xs tracking-wider">
              <span>EVERY RIDE HAS A STORY.</span>
              <span>MAKE IT YOURS.</span>
            </div>
          </div>
        </div>
      </section>
      <div className="border-b">
        <div className="container-wide flex flex-wrap items-center justify-between gap-5 py-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            One place. Your entire riding journey.
          </span>
          <span>Discover with confidence</span>
          <span>Learn beyond the specs</span>
          <span>Own with clarity</span>
        </div>
      </div>
      <section className="container-wide section-space">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">Find your kind of ride</p>
            <h2 className="section-title">
              Different machines. Same obsession.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A considered selection for the curious rider.
            </p>
          </div>
          <Link
            href="/motorcycles"
            className="text-sm font-medium text-primary"
          >
            Explore all motorcycles
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((b) => (
            <MotorcycleCard key={b.id} bike={b} />
          ))}
        </div>
        <p className="mt-7 text-xs text-muted-foreground">
          Demo catalogue · Specifications and photos are illustrative, not
          verified model-year information.
        </p>
      </section>
      <section className="border-y bg-secondary/50">
        <div className="container-wide section-space grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-4">More than a spec sheet</p>
            <h2 className="section-title max-w-sm text-3xl md:text-4xl">
              A little knowledge.
              <br />A better relationship
              <br />
              with your motorcycle.
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
              Understand what’s beneath the tank, what matters on the road, and
              what keeps your motorcycle at its best.
            </p>
            <Link href="/knowledge" className="link-button mt-7">
              Visit the knowledge centre
            </Link>
          </div>
          <div className="divide-y border-t">
            {[
              {
                icon: Compass,
                title: "Discover your next motorcycle",
                text: "Explore models, decode specifications and compare the details that matter.",
                href: "/motorcycles",
              },
              {
                icon: BookOpen,
                title: "Make the technical feel simple",
                text: "Clear, practical guides to engines, components and the way they work together.",
                href: "/knowledge",
              },
              {
                icon: Fuel,
                title: "Know what every kilometre costs",
                text: "Fuel, mileage and ownership spending, connected in your personal garage.",
                href: "/fuel",
              },
              {
                icon: Wrench,
                title: "Keep the whole story",
                text: "Service records and thoughtful reminders, ready when you need them.",
                href: "/maintenance",
              },
            ].map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="flex gap-5 py-6"
              >
                <item.icon className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-wide section-space grid items-center gap-12 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 md:p-9">
          <div className="flex items-center justify-between border-b pb-5">
            <span className="font-semibold">Your ownership, at a glance</span>
            <span className="text-xs text-muted-foreground">Sample garage</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded">
              <Image
                src="/images/classic.jpg"
                alt="Illustrative motorcycle photograph"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                ROYAL ENFIELD · 2024
              </p>
              <h3 className="mt-1 text-xl font-medium">Classic 350</h3>
            </div>
          </div>
          <div className="my-7 grid grid-cols-3 gap-3">
            {demoPreview().map(([v, l]) => (
              <div key={l}>
                <p className="font-mono text-xl md:text-2xl">{v}</p>
                <p className="mt-2 text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 rounded bg-secondary p-4">
            <Wrench className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                A little attention goes a long way
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tyre check · Personal reminder
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t pt-5 text-sm">
            <Check className="size-4 text-success" />
            <span>Last service safely in your story</span>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4">Your personal garage</p>
          <h2 className="section-title text-3xl md:text-4xl">
            Less remembering.
            <br />
            More riding.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">
            Every refill, every service, every small improvement. Give your
            motorcycle a home for everything that happens between the rides.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Understand real-world fuel economy",
              "See your spending without the spreadsheets",
              "Keep service history and maintenance together",
            ].map((t) => (
              <li className="flex gap-3" key={t}>
                <Check className="size-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
          <Link href="/login" className="link-button mt-8">
            Try the demo garage
          </Link>
        </div>
      </section>
      <section className="border-t">
        <div className="container-wide section-space">
          <p className="eyebrow mb-3">A simpler ownership journey</p>
          <h2 className="section-title">
            Get to know it. Make it yours. Keep it going.
          </h2>
          <div className="mt-10 grid gap-9 md:grid-cols-3">
            {[
              [
                "Find your motorcycle",
                "Browse the catalogue or add a supported model to your garage.",
              ],
              [
                "Build your story",
                "Log a refill, save a service and start seeing the bigger picture.",
              ],
              [
                "Ride with clarity",
                "Learn as you go, follow your manual and keep useful reminders close.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-t-2 border-primary pt-5">
                <h3 className="font-medium">{t}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
