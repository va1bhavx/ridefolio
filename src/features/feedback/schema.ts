import { z } from "zod"
export const feedbackSchema = z
  .object({
    kind: z.enum([
      "General feedback",
      "Report an issue",
      "Suggest a motorcycle",
      "Suggest knowledge content",
    ]),
    message: z
      .string()
      .trim()
      .min(10, "Please include at least 10 characters.")
      .max(3000),
    email: z.union([
      z.literal(""),
      z.email("Enter a valid email or leave blank."),
    ]),
    consent: z.boolean(),
  })
  .refine((v) => !v.email || v.consent, {
    path: ["consent"],
    message: "Please consent to including your email, or remove it.",
  })
