import { z } from "zod"
export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})
export const registerSchema = loginSchema
  .extend({
    name: z.string().trim().min(2, "Enter at least two characters.").max(80),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Za-z]/, "Include a letter.")
      .regex(/[0-9]/, "Include a number."),
    confirm: z.string(),
    consent: z
      .boolean()
      .refine(Boolean, "Please acknowledge the local demo terms."),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don’t match.",
    path: ["confirm"],
  })
