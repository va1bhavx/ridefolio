import { z } from "zod"
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.email(),
  distance: z.literal("km"),
  currency: z.literal("INR"),
  reminders: z.boolean(),
})
