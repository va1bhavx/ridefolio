"use client"
import { Bike, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}: {
  title?: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <Bike className="mx-auto mb-4 size-8 text-primary" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 mb-5 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  )
}
export function LoadingState() {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground"
    >
      <LoaderCircle className="size-5 animate-spin" />
      Loading your ride…
    </div>
  )
}
export function ErrorState({
  message,
  retry,
}: {
  message: string
  retry?: () => void
}) {
  return (
    <div role="alert" className="panel p-8">
      <h2 className="font-semibold">We couldn’t load this view</h2>
      <p className="my-3 text-sm text-muted-foreground">{message}</p>
      {retry && <Button onClick={retry}>Try again</Button>}
    </div>
  )
}
