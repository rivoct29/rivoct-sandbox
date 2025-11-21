import type { Response, NextFunction } from "express";
import type { RequestWithContext } from "../types";
import { UsageService } from "../services/usageService";
import { config } from "../config";

export const rateLimit = async (
  req: RequestWithContext,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.authContext) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    const usage = await UsageService.reserveQuota(req.authContext.customerId);
    req.rateLimits = {
      minuteCount: usage.minuteCount,
      dayCount: usage.dayCount,
      monthCount: usage.monthCount,
      minuteLimit: config.rateLimit.minute,
      dayLimit: config.rateLimit.day,
      monthLimit: config.rateLimit.month
    };
    next();
  } catch (error) {
    const code = error instanceof Error ? error.message : "RATE_LIMIT_ERROR";
    let status = 429;
    if (
      code === "RATE_LIMIT_MINUTE_EXCEEDED" ||
      code === "RATE_LIMIT_DAY_EXCEEDED" ||
      code === "RATE_LIMIT_MONTH_EXCEEDED"
    ) {
      status = 429;
    }
    res.status(status).json({ error: "Rate limit exceeded", code });
  }
};
