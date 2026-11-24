"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/shared/fields"
import { authentication } from "@/services/authentication"
import { loginSchema, registerSchema } from "../schemas"
type Values = z.infer<typeof registerSchema>
export function AuthForm({ registering = false }: { registering?: boolean }) {
  const [show, setShow] = useState(false),
    [error, setError] = useState("")
  const router = useRouter(),
    client = useQueryClient()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(
      registering
        ? registerSchema
        : loginSchema.extend({
            name: z.string(),
            confirm: z.string(),
            consent: z.boolean(),
          })
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      consent: false,
    },
  })
  async function submit(v: Values) {
    setError("")
    try {
      const user = registering
        ? await authentication.register(v.name, v.email, v.password)
        : await authentication.login(v.email, v.password)
      client.clear()
      client.setQueryData(["session"], user)
      toast.success(
        registering ? "Your local garage is ready" : "Welcome to your garage"
      )
      const target = new URLSearchParams(window.location.search).get("next")
      router.push(
        target?.startsWith("/") && !target.startsWith("//")
          ? target
          : "/overview"
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.")
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        {registering && (
          <Field label="Your name" id="name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>
        )}
        <Field label="Email address" id="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
        <Field label="Password" id="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              className="pr-12"
              type={show ? "text" : "password"}
              autoComplete={registering ? "new-password" : "current-password"}
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute top-0 right-0"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </Field>
        {registering && (
          <>
            <Field
              label="Confirm password"
              id="confirm"
              error={errors.confirm?.message}
            >
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirm")}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? "confirm-error" : undefined}
              />
            </Field>
            <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
              <input
                type="checkbox"
                className="mt-1.5 size-4 accent-primary"
                {...register("consent")}
              />
              I understand this is a local demo. My records stay in this browser
              and are not backed up.
            </label>
            {errors.consent && (
              <p role="alert" className="text-sm text-destructive">
                {errors.consent.message}
              </p>
            )}
          </>
        )}
        {error && (
          <p
            role="alert"
            className="rounded border border-destructive/30 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? "Opening your garage…"
            : registering
              ? "Create your local account"
              : "Sign in"}
        </Button>
      </form>
      {!registering && (
        <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
          <p className="text-sm font-medium">Take it for a spin.</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Sample account: demo@ridefolio.app
            <br />
            Password: Ridefolio123!
          </p>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              setValue("email", "demo@ridefolio.app")
              setValue("password", "Ridefolio123!")
              void handleSubmit(submit)()
            }}
          >
            Explore the demo garage
          </Button>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {registering ? "Already have an account?" : "New to Ridefolio?"}{" "}
        <Link
          className="font-medium text-primary"
          href={registering ? "/login" : "/register"}
        >
          {registering ? "Sign in" : "Start your garage"}
        </Link>
      </p>
      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        Mock authentication only. This is not production security. Use a unique
        demo password and avoid sensitive personal information.
      </p>
    </>
  )
}
