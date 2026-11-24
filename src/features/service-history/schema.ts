import { z } from "zod"
import { recordDate, odometerValue, notesValue } from "@/lib/validators/records"
export const serviceSchema = z.object({
  bikeId: z.string().min(1),
  date: recordDate,
  odometer: odometerValue,
  work: z.string().trim().min(3, "Describe the work performed.").max(500),
  parts: z.string().max(500),
  centre: z
    .string()
    .trim()
    .min(2, "Enter a workshop name, or Self-service.")
    .max(150),
  amount: z
    .number({ error: "Enter a cost, including 0 for free service." })
    .min(0)
    .max(10000000),
  notes: notesValue,
})
