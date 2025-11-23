import type { Request, Response } from "express";
import { z } from "zod";
import CarrierProvider from "../providers/carrier";

// Accept flexible payloads from Midhun; prefer known fields but allow passthrough
const bodySchema = z.object({
  customerId: z.string().optional(),
  planId: z.string().optional()
}).catchall(z.any());

export async function carrierActivateHandler(req: Request, res: Response) {
  const parse = bodySchema.safeParse(req.body ?? {});
  if (!parse.success) {
    return res.status(400).json({ error: "invalid_payload", details: parse.error.format() });
  }

  const payload = parse.data as Record<string, any>;

  const provider = new CarrierProvider();
  const result = await provider.activateService(payload.customerId ?? payload.To ?? '', payload.planId ?? undefined, payload);

  if (result.status === "error") {
    return res.status(502).json({ status: "error", message: result.message });
  }

  return res.status(200).json({ status: "ok", carrierTxnId: result.carrierTxnId ?? null });
}

export default carrierActivateHandler;
