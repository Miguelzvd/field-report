import { StorageProvider } from "./storage.interface"
import { CloudinaryStorage } from "./cloudinary.storage"
import { LocalStorage } from "./local.storage"

let instance: StorageProvider | null = null

export function getStorage(): StorageProvider {
  if (instance) return instance

  const provider = process.env.STORAGE_PROVIDER ?? "local"

  if (provider === "cloudinary") {
    instance = new CloudinaryStorage()
  } else {
    instance = new LocalStorage()
  }

  return instance
}
