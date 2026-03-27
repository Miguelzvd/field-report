import { Request, Response } from "express";
import * as authService from "./auth.service";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { name, email, password } = parsed.data;
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { email, password } = parsed.data;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { refreshToken } = parsed.data;
    const tokens = await authService.refresh(refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}
