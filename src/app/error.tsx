"use client"
import { ErrorState } from "@/components/feedback/states"
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="container-wide py-20">
      <ErrorState
        message="Something interrupted this page. Your previously saved records are still in your browser."
        retry={reset}
      />
    </main>
  )
}
