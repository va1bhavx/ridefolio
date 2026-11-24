import { AuthForm } from "@/features/authentication/components/auth-form"
export const metadata = { title: "Sign in" }
export default function Page() {
  return (
    <>
      <p className="eyebrow mb-4">Welcome back, rider</p>
      <h1 className="page-title">Your story continues.</h1>
      <p className="mt-3 mb-8 text-muted-foreground">
        Sign in to your personal garage.
      </p>
      <AuthForm />
    </>
  )
}
