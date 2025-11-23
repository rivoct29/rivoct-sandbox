import type { Response } from "express";
import { z } from "zod";
import { firestore } from "firebase-admin";
import type { RequestWithContext } from "../types";
import { fetchLogs } from "../services/logService";
import type { VoiceLogEntry } from "../shared.js";

const querySchema = z.object({
  limit: z
    .preprocess((val) => {
      if (Array.isArray(val)) return Number(val[0]);
      if (typeof val === "string") return Number(val);
      return undefined;
    }, z.number().int().positive().optional())
    .transform((val) => val ?? 50),
  status: z
    .preprocess((val) => {
      if (Array.isArray(val)) return val[0];
      return val;
    }, z.enum(["queued", "answered", "failed"]).optional())
});

const serializeLog = (log: VoiceLogEntry): VoiceLogEntry => {
  const createdAtTs = (log as VoiceLogEntry & { createdAt: firestore.Timestamp }).createdAt;
  return {
    ...log,
    createdAt:
      createdAtTs instanceof firestore.Timestamp ? createdAtTs.toDate().toISOString() : log.createdAt
  };
};

export const logsHandler = async (req: RequestWithContext, res: Response): Promise<void> => {
  try {
    if (!req.authContext) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    const query = querySchema.parse(req.query);
      const startAfter = req.query?.startAfter ? String(req.query.startAfter) : undefined;
      const items = await fetchLogs(req.authContext.customerId, {
        limit: query.limit,
        status: query.status,
        startAfter
      });
    res.json({ items: items.map(serializeLog) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid query parameters", code: "INVALID_QUERY", details: error.flatten() });
      return;
    }
    const code = error instanceof Error ? error.message : "LOGS_ERROR";
    res.status(400).json({ error: "Unable to fetch logs", code });
  }
};
