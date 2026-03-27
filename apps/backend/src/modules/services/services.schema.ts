import { z } from "zod"

export const createServiceSchema = z.object({
  type: z.enum(["preventiva", "corretiva", "instalação", "inspeção"]),
})

export const updateServiceSchema = z.object({
  type: z.enum(["preventiva", "corretiva", "instalação", "inspeção"]).optional(),
  status: z.enum(["open", "finished"]).optional(),
})
