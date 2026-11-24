import { z } from "zod"
export const garageSchema = z.object({
  modelId: z.string().min(1, "Choose a model."),
  nickname: z.string().trim().max(60),
  year: z.number().int().min(2000),
  variant: z.string().min(1, "Choose a variant."),
  purchaseDate: z.string(),
  odometer: z.number().min(0, "Odometer cannot be negative.").max(2000000),
})
