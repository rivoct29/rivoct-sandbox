import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { config } from "./config";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { rateLimit } from "./middleware/rateLimit";
import { voiceOtpHandler } from "./api/voiceOtp";
import { logsHandler } from "./api/logs";
import { usageSummaryHandler } from "./api/usage";
import { webhookApp } from "./api/webhooks";
import { consoleApp } from "./api/console";
import { carrierActivateHandler } from "./api/carrier";
import { onUserCreated } from "./triggers/userOnboarding";

// Enforce region globally (auto-heal rule)
setGlobalOptions({ region: "asia-south1" });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", region: config.region });
});

app.post("/v1/voice-otp", apiKeyAuth, rateLimit, voiceOtpHandler);
app.get("/v1/logs", apiKeyAuth, logsHandler);
app.get("/v1/usage/summary", apiKeyAuth, usageSummaryHandler);
app.get("/v1/webhooks", apiKeyAuth, webhookApp);
app.get("/v1/console", apiKeyAuth, consoleApp);
app.post("/v1/carrier/activate", apiKeyAuth, rateLimit, carrierActivateHandler);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unknown error";
  res.status(500).json({ error: "Internal Server Error", code: message });
});

export const api = onRequest(
  {
    region: "asia-south1",
    cors: { origin: true } as unknown as boolean,
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  app
);

export const webhooks = onRequest(
  {
    region: "asia-south1",
    cors: true,
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  webhookApp
);

export const consoleApi = onRequest(
  {
    region: "asia-south1",
    cors: true,
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  consoleApp
);

export const userOnboarding = onUserCreated;
