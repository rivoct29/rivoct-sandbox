import type { Response } from "express";
import { z } from "zod";
import type { RequestWithContext } from "../types";
import { OtpRouter } from "../engine/router";
import { assertIndiaPhone } from "../shared.js";

const voiceOtpSchema = z.object({
  phone: z.string(),
  otpCode: z.string().min(4).max(8),
  metadata: z.record(z.unknown()).optional()
});

export const voiceOtpHandler = async (req: RequestWithContext, res: Response): Promise<void> => {
  try {
    if (!req.authContext) {
      res.status(401).json({ error: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    const payload = voiceOtpSchema.parse(req.body);
    assertIndiaPhone(payload.phone);

    const result = await OtpRouter.routeAndSend({
      customerId: req.authContext.customerId,
      phone: payload.phone,
      otpCode: payload.otpCode,
      metadata: payload.metadata
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid payload", code: "INVALID_BODY", details: error.flatten() });
      return;
    }
    const code = error instanceof Error ? error.message : "VOICE_OTP_ERROR";
    res.status(400).json({ error: "Unable to process voice OTP", code });
  }
};
