"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}
export function InstallApp() {
  const [event, setEvent] = useState<InstallEvent | null>(null)
  useEffect(() => {
    const listener = (e: Event) => {
      e.preventDefault()
      setEvent(e as InstallEvent)
    }
    window.addEventListener("beforeinstallprompt", listener)
    return () => window.removeEventListener("beforeinstallprompt", listener)
  }, [])
  return (
    <Button
      variant="outline"
      onClick={async () => {
        if (event) {
          await event.prompt()
          await event.userChoice
          setEvent(null)
        } else {
          toast.info(
            "Use your browser’s Install app or Add to Home Screen option. Availability depends on the browser and HTTPS (or localhost)."
          )
        }
      }}
    >
      Install Ridefolio
    </Button>
  )
}
