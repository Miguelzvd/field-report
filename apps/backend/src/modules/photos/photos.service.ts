import { getStorage } from "../../storage/storage.factory"
import * as photosRepository from "./photos.repository"
import * as servicesRepository from "../services/services.repository"
import { PhotoSelect } from "../../db/schema"

export async function uploadPhoto(
  serviceId: string,
  userId: string,
  fileBuffer: Buffer,
  originalName: string
): Promise<PhotoSelect> {
  const service = await servicesRepository.findServiceByIdAndUserId(serviceId, userId)

  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 })
  }

  const storage = getStorage()
  const { url, publicId } = await storage.upload(
    fileBuffer,
    originalName,
    `field-report/${serviceId}`
  )

  return photosRepository.createPhoto({ serviceId, url, publicId })
}
