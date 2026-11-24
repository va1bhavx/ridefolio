import type { AuthenticationService } from "./interfaces/repositories"
import type { User } from "@/types/models"
import { persistence } from "./persistence"
import { demoOwnership } from "./mock/ownership-data"
interface LocalAccount {
  user: User
  salt: string
  digest: string
}
async function digest(password: string, salt: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${password}`)
  )
  return Array.from(new Uint8Array(bytes), (v) =>
    v.toString(16).padStart(2, "0")
  ).join("")
}
const demo: User = {
  id: "demo",
  name: "Arjun Mehta",
  email: "demo@ridefolio.app",
}
// UX demonstration only. Client-side credentials and route guards offer no security boundary.
export const authentication: AuthenticationService = {
  async session() {
    return persistence.read<User | null>("session", null)
  },
  async login(email, password) {
    const normalised = email.trim().toLowerCase()
    if (normalised === demo.email && password === "Ridefolio123!") {
      persistence.write("session", demo)
      return demo
    }
    const account = persistence
      .read<LocalAccount[]>("accounts", [])
      .find((a) => a.user.email === normalised)
    if (!account || (await digest(password, account.salt)) !== account.digest)
      throw new Error(
        "Email or password doesn’t match. Use the demo account or register in this browser."
      )
    persistence.write("session", account.user)
    return account.user
  },
  async register(name, email, password) {
    const normalised = email.trim().toLowerCase(),
      accounts = persistence.read<LocalAccount[]>("accounts", [])
    if (
      normalised === demo.email ||
      accounts.some((a) => a.user.email === normalised)
    )
      throw new Error(
        "An account with this email already exists in this browser."
      )
    const user = { id: crypto.randomUUID(), name, email: normalised },
      salt = crypto.randomUUID()
    accounts.push({ user, salt, digest: await digest(password, salt) })
    const empty = demoOwnership()
    empty.garage = []
    empty.fuel = []
    empty.expenses = []
    empty.services = []
    empty.reminders = []
    empty.preferences = { ...empty.preferences, name, email: normalised }
    persistence.write(`ownership:${user.id}`, empty)
    persistence.write("accounts", accounts)
    persistence.write("session", user)
    return user
  },
  async signOut() {
    persistence.remove("session")
  },
}
