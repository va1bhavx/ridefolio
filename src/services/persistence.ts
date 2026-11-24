// Browser persistence is deliberately isolated here. Nothing stored here is secure.
export const persistence = {
  read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback
    const raw = window.localStorage.getItem(`ridefolio:v1:${key}`)
    if (!raw) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      throw new Error(
        "Saved demo data could not be read. Clear Ridefolio site data in your browser to start again."
      )
    }
  },
  write<T>(key: string, value: T) {
    try {
      window.localStorage.setItem(`ridefolio:v1:${key}`, JSON.stringify(value))
    } catch {
      throw new Error(
        "Your browser could not save this change. Check available storage and browser permissions."
      )
    }
  },
  remove(key: string) {
    window.localStorage.removeItem(`ridefolio:v1:${key}`)
  },
}
