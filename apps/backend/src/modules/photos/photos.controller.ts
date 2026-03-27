import { Request, Response } from "express"
import * as photosService from "./photos.service"

export async function uploadPhoto(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado", statusCode: 400 })
      return
    }

    const photo = await photosService.uploadPhoto(
      req.params.id as string,
      req.user!.userId,
      req.file.buffer,
      req.file.originalname
    )

    res.status(201).json(photo)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res.status(error.statusCode ?? 500).json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}
