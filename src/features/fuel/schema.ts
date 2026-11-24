import { z } from "zod"
import {
  recordDate,
  positiveAmount,
  odometerValue,
  notesValue,
} from "@/lib/validators/records"
export const fuelSchema = z.object({
  bikeId: z.string().min(1),
  date: recordDate,
  odometer: odometerValue,
  amount: positiveAmount,
  litres: z
    .number({ error: "Enter litres." })
    .positive("Quantity must be positive.")
    .max(100, "Enter a realistic motorcycle refill, up to 100 litres."),
  fullTank: z.boolean(),
  notes: notesValue,
})
