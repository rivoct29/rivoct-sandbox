import express, { type Request, type Response } from "express";
import { z } from "zod";
import { db } from "../utils/firestore";
import { Timestamp } from "firebase-admin/firestore";
import { secrets } from "../config";

const app = express();
app.use(express.json());

const deliverySchema = z.object({
  requestId: z.string().min(10),
  customerId: z.string().min(3),
  status: z.enum(["queued", "answered", "failed"]),
  durationSeconds: z.number().int().min(0).max(600),
  deliveredAt: z.string().datetime()
});

// DB Collections
const logs = db.collection("voice_logs");
const usage = db.collection("usage_counters");
const webhookEvents = db.collection("webhook_events");

app.post("/mcm/delivery-status", async (req: Request, res: Response) => {
  try {
    const headerSecret = req.header("x-webhook-secret");
    const secret = await secrets.getWebhookSecret();
    
    if (!secret) {
        console.error("WEBHOOK_SECRET not configured");
        res.status(500).json({ error: "Server configuration error" });
        return;
    }
    
    if (!headerSecret || headerSecret !== secret) {
      res.status(401).json({ error: "Invalid webhook secret" });
      return;
    }

    const payload = deliverySchema.parse(req.body);

    // Process Logic
    const logSnap = await logs
      .where("requestId", "==", payload.requestId)
      .where("customerId", "==", payload.customerId)
      .limit(1)
      .get();

    if (logSnap.empty) {
       res.status(404).json({ error: "Webhook processing failed", code: "VOICE_LOG_NOT_FOUND" });
       return;
    }

    const logRef = logSnap.docs[0].ref;
    await logRef.set(
      {
        status: payload.status,
        durationSeconds: payload.durationSeconds,
        deliveredAt: payload.deliveredAt,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );

    await usage.doc(payload.customerId).set(
      {
        lastWebhookAt: Timestamp.now(),
        lastWebhookStatus: payload.status
      },
      { merge: true }
    );

    await webhookEvents.add({
      ...payload,
      receivedAt: Timestamp.now()
    });

    res.status(202).json({ status: "accepted" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid payload", details: error.flatten() });
      return;
    }
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export const webhookApp = app;
