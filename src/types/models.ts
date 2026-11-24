export interface Motorcycle {
  id: string
  brand: string
  name: string
  category: string
  tagline: string
  description: string
  image: string
  years: number[]
  variants: string[]
  displacement: number
  power: number
  torque: number
  weight: number
  tank: number
  seat: number
  engine: string
  cooling: string
  transmission: string
  suspension: string
  brakes: string
  tyres: string
  dimensions: string
}
export interface Article {
  slug: string
  title: string
  category: string
  minutes: number
  intro: string
  sections: { title: string; body: string }[]
  motorcycles: string[]
}
export interface User {
  id: string
  name: string
  email: string
}
export interface GarageBike {
  id: string
  modelId: string
  nickname: string
  year: number
  variant: string
  purchaseDate: string
  odometer: number
}
export interface FuelEntry {
  id: string
  bikeId: string
  date: string
  odometer: number
  amount: number
  litres: number
  fullTank: boolean
  notes: string
}
export type ExpenseCategory = "Repairs" | "Parts and accessories" | "Other"
export interface Expense {
  id: string
  bikeId: string
  date: string
  category: ExpenseCategory
  amount: number
  description: string
  notes: string
}
export interface ServiceRecord {
  id: string
  bikeId: string
  date: string
  odometer: number
  work: string
  parts: string
  centre: string
  amount: number
  notes: string
}
export interface Reminder {
  id: string
  bikeId: string
  title: string
  date: string
  odometer?: number
  completed: boolean
  source: "General guidance" | "User-created"
  notes: string
}
export interface Feedback {
  id: string
  kind: string
  message: string
  email: string
  consent: boolean
}
export interface Preferences {
  name: string
  email: string
  distance: "km"
  currency: "INR"
  reminders: boolean
}
export interface OwnershipData {
  garage: GarageBike[]
  fuel: FuelEntry[]
  expenses: Expense[]
  services: ServiceRecord[]
  reminders: Reminder[]
  feedback: Feedback[]
  preferences: Preferences
}
export type Collection = Exclude<keyof OwnershipData, "preferences">
