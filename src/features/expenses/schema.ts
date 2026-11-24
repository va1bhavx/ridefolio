import { z } from "zod"
import {
  recordDate,
  positiveAmount,
  notesValue,
} from "@/lib/validators/records"
export const expenseSchema = z.object({
  bikeId: z.string().min(1),
  date: recordDate,
  category: z.enum(["Repairs", "Parts and accessories", "Other"]),
  amount: positiveAmount,
  description: z
    .string()
    .trim()
    .min(3, "Describe the expense in at least 3 characters.")
    .max(200),
  notes: notesValue,
})
