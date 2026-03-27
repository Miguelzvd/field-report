import { z } from "zod"

export const createReportSchema = z.object({
  responsibleName: z.string().min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  notes: z.string().min(1, "Observações são obrigatórias"),
})
