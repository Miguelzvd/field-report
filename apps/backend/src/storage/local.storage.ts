import fs from "fs/promises"
import path from "path"
import { StorageProvider, UploadResult } from "./storage.interface"

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads")

export class LocalStorage implements StorageProvider {
  async upload(buffer: Buffer, filename: string, folder: string): Promise<UploadResult> {
    const dir = path.join(UPLOADS_DIR, folder)
    await fs.mkdir(dir, { recursive: true })

    const publicId = `${folder}/${Date.now()}-${filename}`
    const filePath = path.join(UPLOADS_DIR, publicId)

    await fs.writeFile(filePath, buffer)

    const baseUrl = process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 3001}`
    const url = `${baseUrl}/uploads/${publicId}`

    return { url, publicId }
  }

  async delete(publicId: string): Promise<void> {
    const filePath = path.join(UPLOADS_DIR, publicId)
    await fs.unlink(filePath).catch(() => {
      // ignora se o arquivo já não existe
    })
  }
}
