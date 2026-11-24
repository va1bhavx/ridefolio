"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Field } from "@/components/shared/fields"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { feedbackRepository } from "@/services/feedback"
import { feedbackSchema } from "../schema"
export function FeedbackForm() {
  const [saved, setSaved] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      kind: "General feedback",
      message: "",
      email: "",
      consent: false,
    },
  })
  return (
    <form
      className="panel max-w-2xl space-y-5 p-6 md:p-8"
      noValidate
      onSubmit={handleSubmit(async (v) => {
        try {
          await feedbackRepository.save({ ...v, id: crypto.randomUUID() })
          setSaved(true)
          reset()
          toast.success("Feedback saved locally")
        } catch (e) {
          toast.error(
            e instanceof Error ? e.message : "Could not save feedback"
          )
        }
      })}
    >
      {saved && (
        <p
          role="status"
          className="rounded bg-success/10 p-4 text-sm text-success"
        >
          Thank you. Your feedback is saved in this browser only. It has not
          been sent to a team or server.
        </p>
      )}
      <Field label="What would you like to share?" id="kind">
        <select id="kind" className="control" {...register("kind")}>
          {[
            "General feedback",
            "Report an issue",
            "Suggest a motorcycle",
            "Suggest knowledge content",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>
      <Field label="Your feedback" id="message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell us what would make Ridefolio more useful for your next ride…"
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>
      <Field
        label="Contact email (optional)"
        id="contact-email"
        error={errors.email?.message}
      >
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          type="checkbox"
          className="mt-1.5 size-4 accent-primary"
          {...register("consent")}
        />
        I consent to saving my email with this feedback on this device.
      </label>
      {errors.consent && (
        <p role="alert" className="text-sm text-destructive">
          {errors.consent.message}
        </p>
      )}
      <p className="text-xs leading-5 text-muted-foreground">
        Frontend demonstration: this form saves locally and does not send
        messages. Please avoid sensitive information.
      </p>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save feedback locally"}
      </Button>
    </form>
  )
}
