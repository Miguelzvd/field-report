import { eq } from "drizzle-orm"
import { db } from "../../db"
import { reports, ReportInsert, ReportSelect } from "../../db/schema"

export async function findReportByServiceId(
  serviceId: string
): Promise<ReportSelect | undefined> {
  const result = await db
    .select()
    .from(reports)
    .where(eq(reports.serviceId, serviceId))
    .limit(1)
  return result[0]
}

export async function createReport(data: ReportInsert): Promise<ReportSelect> {
  const result = await db.insert(reports).values(data).returning()
  return result[0]
}
