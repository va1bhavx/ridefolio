"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Bike,
  Fuel,
  Wallet,
  Wrench,
  History,
  Settings,
  Menu,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import { Brand, ThemeToggle } from "@/components/navigation/public-nav"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useSession } from "@/features/authentication"
import { LoadingState, ErrorState } from "@/components/feedback/states"
const links = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/garage", label: "My garage", icon: Bike },
  { href: "/fuel", label: "Fuel", icon: Fuel },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/service-history", label: "Service history", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
]
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    router = useRouter(),
    session = useSession(),
    [menu, setMenu] = useState(false)
  useEffect(() => {
    if (session.isSuccess && !session.data)
      router.replace(
        `/login?next=${encodeURIComponent(path + window.location.search)}`
      )
  }, [session.isSuccess, session.data, router, path])
  if (session.isError)
    return (
      <ErrorState
        message={session.error.message}
        retry={() => void session.refetch()}
      />
    )
  if (!session.data) return <LoadingState />
  const navigation = (
    <nav aria-label="Garage navigation" className="space-y-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={() => setMenu(false)}
          aria-current={path === l.href ? "page" : undefined}
          className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm ${path === l.href ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary"}`}
        >
          <l.icon className="size-[18px]" />
          {l.label}
        </Link>
      ))}
    </nav>
  )
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-card px-5 py-7 lg:flex">
        <Brand />
        <p className="mt-12 mb-4 px-3 text-[11px] tracking-widest text-muted-foreground uppercase">
          Your ownership
        </p>
        {navigation}
        <div className="mt-auto space-y-3 border-t pt-5">
          <Link
            className="flex items-center gap-3 px-3 text-sm text-muted-foreground"
            href="/motorcycles"
          >
            <BookOpen className="size-4" />
            Explore & learn
          </Link>
          <Link
            className="flex items-center gap-3 px-3 text-sm text-muted-foreground"
            href="/feedback"
          >
            <MessageSquare className="size-4" />
            Share feedback
          </Link>
          <div className="mt-6 rounded-md bg-secondary p-3">
            <p className="text-xs font-medium">
              {session.data.id === "demo" ? "Sample garage" : "Local prototype"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Saved in this browser only. No cloud backup.
            </p>
          </div>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="flex h-20 items-center justify-between gap-4 border-b px-5 md:px-10">
          <div className="lg:hidden">
            <Brand />
          </div>
          <p className="hidden text-sm text-muted-foreground lg:block">
            Your garage /{" "}
            <span className="text-foreground">
              {links.find((l) => l.href === path)?.label}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {session.data.id === "demo"
                ? "DEMO WORKSPACE"
                : "LOCAL WORKSPACE"}
            </span>
            <ThemeToggle />
            <Link
              href="/settings"
              aria-label="Account settings"
              className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
            >
              {session.data.name.slice(0, 1)}
            </Link>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto max-w-[1500px] px-5 py-8 pb-28 md:px-10 md:py-10 lg:pb-12"
        >
          {children}
        </main>
      </div>
      <nav
        aria-label="Mobile garage navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-card px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {links.slice(0, 4).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={path === l.href ? "page" : undefined}
            className={`flex min-w-14 flex-col items-center gap-1 p-2 text-[11px] ${path === l.href ? "text-primary" : "text-muted-foreground"}`}
          >
            <l.icon className="size-5" />
            {l.label}
          </Link>
        ))}
        <Button
          variant="ghost"
          className="h-auto flex-col gap-1 p-2 text-[11px]"
          onClick={() => setMenu(true)}
        >
          <Menu className="size-5" />
          More
        </Button>
      </nav>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent>
          <DialogTitle>Your garage</DialogTitle>
          <DialogDescription>All your ownership tools.</DialogDescription>
          {navigation}
          <Link href="/motorcycles" className="link-secondary">
            Explore motorcycles
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  )
}
