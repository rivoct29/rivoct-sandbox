import type { Response } from "express";
import type { RequestWithContext } from "../types";
import { UsageService } from "../services/usageService";
import { config } from "../config";

export const usageSummaryHandler = async (req: RequestWithContext, res: Response): Promise<void> => {
  try {
    if (!req.authContext) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    const usage = await UsageService.getUsageSummary(req.authContext.customerId);
    res.json({
      customerId: req.authContext.customerId,
      minuteCount: usage.minuteCount,
      dayCount: usage.dayCount,
      monthCount: usage.monthCount,
      minuteLimit: config.rateLimit.minute,
      dayLimit: config.rateLimit.day,
      monthLimit: config.rateLimit.month,
      totalCostInr: Number(usage.totalCostInr.toFixed(4)),
      updatedAt: usage.updatedAt.toDate().toISOString()
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "USAGE_ERROR";
    res.status(400).json({ error: "Unable to fetch usage", code });
  }
};
