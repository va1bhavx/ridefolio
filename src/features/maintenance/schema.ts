import { z } from "zod"
import { notesValue } from "@/lib/validators/records"
export const reminderSchema = z.object({
  bikeId: z.string().min(1),
  title: z.string().trim().min(3, "Describe the reminder.").max(150),
  date: z.iso.date("Choose a due date."),
  odometer: z
    .string()
    .refine(
      (v) => v === "" || (/^\d+$/.test(v) && Number(v) <= 2000000),
      "Enter a whole kilometre reading, or leave blank."
    ),
  notes: notesValue,
})
