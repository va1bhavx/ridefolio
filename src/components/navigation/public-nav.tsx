"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
export function Brand() {
  return (
    <Link
      href="/"
      aria-label="Ridefolio home"
      className="flex items-center gap-2.5 text-xl font-semibold tracking-tight"
    >
      <span
        aria-hidden
        className="flex size-8 items-center justify-center rounded-sm bg-primary font-heading text-lg font-bold text-primary-foreground italic"
      >
        r.
      </span>
      ridefolio
      <span className="mb-3 size-1 rounded-full bg-gold" />
    </Link>
  )
}
const links = [
  ["/motorcycles", "Explore motorcycles"],
  ["/brands", "Brands"],
  ["/knowledge", "Knowledge"],
  ["/compare", "Compare"],
]
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  )
}
export function PublicNav() {
  const path = usePathname(),
    [open, setOpen] = useState(false)
  return (
    <header className="border-b bg-background">
      <div className="container-wide flex h-20 items-center justify-between gap-5">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-primary ${path.startsWith(href) ? "text-primary" : "text-muted-foreground"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="hidden text-sm sm:block">
            Sign in
          </Link>
          <Link href="/register" className="link-button hidden sm:flex">
            Start your garage
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Explore Ridefolio</DialogTitle>
          <DialogDescription>Your next ride starts here.</DialogDescription>
          <nav className="flex flex-col">
            {[
              ["/", "Home"],
              ...links,
              ["/login", "Sign in"],
              ["/register", "Start your garage"],
            ].map(([href, label]) => (
              <Link
                className="border-b py-3"
                key={href}
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  )
}
