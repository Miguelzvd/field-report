import { v2 as cloudinary } from "cloudinary"
import { StorageProvider, UploadResult } from "./storage.interface"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class CloudinaryStorage implements StorageProvider {
  async upload(buffer: Buffer, filename: string, folder: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, "")}`,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload falhou"))
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      )
      stream.end(buffer)
    })
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}
