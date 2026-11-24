import { AuthForm } from "@/features/authentication/components/auth-form"
export const metadata = { title: "Start your garage" }
export default function Page() {
  return (
    <>
      <p className="eyebrow mb-4">Make it yours</p>
      <h1 className="page-title">Every ride starts somewhere.</h1>
      <p className="mt-3 mb-8 text-muted-foreground">
        Create your local Ridefolio garage.
      </p>
      <AuthForm registering />
    </>
  )
}
