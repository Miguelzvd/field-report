import * as reportsRepository from "./reports.repository"
import * as servicesRepository from "../services/services.repository"
import { ReportSelect, ServiceSelect, ChecklistItemSelect, PhotoSelect } from "../../db/schema"

export interface FullReport {
  report: ReportSelect
  service: ServiceSelect
  checklist: ChecklistItemSelect[]
  photos: PhotoSelect[]
}

export async function createReport(
  serviceId: string,
  userId: string,
  responsibleName: string,
  notes: string
): Promise<ReportSelect> {
  const service = await servicesRepository.findServiceByIdAndUserId(serviceId, userId)

  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 })
  }

  const existing = await reportsRepository.findReportByServiceId(serviceId)
  if (existing) {
    throw Object.assign(new Error("Relatório já existe para este serviço"), { statusCode: 409 })
  }

  return reportsRepository.createReport({ serviceId, responsibleName, notes })
}

export async function getFullReport(
  serviceId: string,
  userId: string
): Promise<FullReport> {
  const service = await servicesRepository.findServiceByIdAndUserId(serviceId, userId)

  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 })
  }

  const report = await reportsRepository.findReportByServiceId(serviceId)
  if (!report) {
    throw Object.assign(new Error("Relatório não encontrado"), { statusCode: 404 })
  }

  const [checklist, photos] = await Promise.all([
    servicesRepository.findChecklistByServiceId(serviceId),
    servicesRepository.findPhotosByServiceId(serviceId),
  ])

  return { report, service, checklist, photos }
}
