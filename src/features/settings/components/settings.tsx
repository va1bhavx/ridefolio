"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Preferences } from "@/types/models"
import { PageHeader } from "@/components/shared/page-header"
import { Field, FilterSelect } from "@/components/shared/fields"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOwnership, useOwnershipActions } from "@/features/garage"
import { LoadingState, ErrorState } from "@/components/feedback/states"
import { authentication } from "@/services/authentication"
import { profileSchema } from "../schema"
import { InstallApp } from "@/components/shared/install-app"
function SettingsForm({ preferences }: { preferences: Preferences }) {
  const actions = useOwnershipActions(),
    { theme, setTheme } = useTheme(),
    router = useRouter(),
    client = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Preferences>({
    resolver: zodResolver(profileSchema),
    defaultValues: preferences,
  })
  return (
    <>
      <form
        noValidate
        className="max-w-3xl space-y-7"
        onSubmit={handleSubmit(async (v) => {
          try {
            await actions.preferences(v)
            toast.success("Preferences saved")
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Unable to save")
          }
        })}
      >
        <section className="panel p-6">
          <h2 className="mb-5 text-lg font-semibold">Your profile</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Display name" error={errors.name?.message}>
              <Input id="name" autoComplete="name" {...register("name")} />
            </Field>
            <Field id="email" label="Account email">
              <Input id="email" type="email" readOnly {...register("email")} />
            </Field>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Your sign-in email is fixed for this local account. Display name
            changes apply to your garage.
          </p>
        </section>
        <section className="panel p-6">
          <h2 className="mb-5 text-lg font-semibold">Make yourself at home</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FilterSelect
              label="Appearance"
              value={theme || "light"}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "Follow device" },
              ]}
            />
            <div>
              <p className="text-sm font-medium">Measurements</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Kilometres · Litres · km/l · Indian rupees (₹)
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                MVP-0 uses Indian metric conventions.
              </p>
            </div>
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              {...register("reminders")}
            />
            Show maintenance reminders on the overview
          </label>
        </section>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save preferences"}
        </Button>
      </form>
      <section className="panel mt-8 max-w-3xl p-6">
        <h2 className="text-lg font-semibold">Your account & this device</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This frontend demo stores records in this browser. Clearing site data
          removes them. Signing out keeps saved records for your next local
          sign-in. There is no cloud sync, password recovery or production
          account service.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <InstallApp />
          <Button
            variant="outline"
            onClick={async () => {
              await authentication.signOut()
              client.clear()
              router.replace("/login")
              toast.success("Signed out")
            }}
          >
            Sign out
          </Button>
        </div>
      </section>
    </>
  )
}
export function Settings() {
  const query = useOwnership()
  if (query.isPending) return <LoadingState />
  if (query.isError) return <ErrorState message={query.error.message} />
  return (
    <>
      <PageHeader
        eyebrow="The way you ride"
        title="Settings"
        description="Your profile, preferences and local workspace."
      />
      <SettingsForm preferences={query.data.preferences} />
    </>
  )
}
