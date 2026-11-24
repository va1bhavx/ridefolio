import { z } from "zod"
import { today } from "@/lib/formatters"
export const recordDate = z.iso
  .date("Enter a valid date.")
  .refine((v) => v <= today(), "Recorded activity cannot be in the future.")
export const positiveAmount = z
  .number({ error: "Enter an amount." })
  .positive("Amount must be greater than zero.")
  .max(10000000)
export const odometerValue = z
  .number({ error: "Enter an odometer reading." })
  .min(0, "Odometer cannot be negative.")
  .max(2000000)
export const notesValue = z
  .string()
  .max(2000, "Keep notes under 2,000 characters.")
