import { PageHeader } from "@/components/shared/page-header"
import { FeedbackForm } from "@/features/feedback/components/feedback-form"
export const metadata = { title: "Share feedback" }
export default function Page() {
  return (
    <div className="container-wide section-space">
      <PageHeader
        eyebrow="Built with riders"
        title="Help shape the next chapter."
        description="An idea, an issue, or a motorcycle we’re missing. We’d like to make space for it."
      />
      <FeedbackForm />
    </div>
  )
}
