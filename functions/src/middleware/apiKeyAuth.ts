import type { Response, NextFunction } from "express";
import { ApiKeyService } from "../services/apiKeyService";
import type { RequestWithContext } from "../types";

export const apiKeyAuth = async (
  req: RequestWithContext,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.header("x-api-key");
    if (!apiKey) {
      res.status(401).json({ error: "Missing x-api-key header", code: "NO_API_KEY" });
      return;
    }

    const authContext = await ApiKeyService.verify(apiKey);
    req.authContext = authContext;
    next();
  } catch (error) {
    const code = error instanceof Error ? error.message : "API_KEY_ERROR";
    res.status(401).json({ error: "Invalid API key", code });
  }
};
