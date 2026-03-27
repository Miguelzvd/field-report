import { Request, Response } from "express"
import { createReportSchema } from "./reports.schema"
import * as reportsService from "./reports.service"

export async function createReport(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createReportSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message, statusCode: 400 })
      return
    }

    const report = await reportsService.createReport(
      req.params.id as string,
      req.user!.userId,
      parsed.data.responsibleName,
      parsed.data.notes
    )

    res.status(201).json(report)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res.status(error.statusCode ?? 500).json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function getReport(req: Request, res: Response): Promise<void> {
  try {
    const fullReport = await reportsService.getFullReport(
      req.params.id as string,
      req.user!.userId
    )

    res.status(200).json(fullReport)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res.status(error.statusCode ?? 500).json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}
