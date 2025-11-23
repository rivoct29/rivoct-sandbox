import { secrets } from "../config";
import type { IVoiceProvider, VoiceProviderInput, VoiceProviderResult } from "./interface";

export class ExotelProvider implements IVoiceProvider {
  id = "exotel";

  async placeCall(input: VoiceProviderInput): Promise<VoiceProviderResult> {
    const apiKey = await secrets.getCarrierApiKey();
    const clientId = await secrets.getCarrierClientId();
    const fromNumber = (await secrets.getCarrierFromNumber()) || process.env.CARRIER_FROM_NUMBER || "";

    if (!apiKey) throw new Error("missing carrier API key");
    if (!clientId) throw new Error("missing carrier client id / account SID");

    // Account SID is provided via clientId secret
    const accountSid = clientId;
    // Use the Exotel API host
    const base = process.env.CARRIER_API_BASE ?? process.env.EXOTEL_BASE ?? "https://api.exotel.com";
    const exoUrl = `${base.replace(/\/$/,"")}/v1/Accounts/${accountSid}/Calls/connect`;

    const [username, token] = apiKey.split(":");
    const auth = username && token ? `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}` : `Basic ${Buffer.from(`:${apiKey}`).toString("base64")}`;

    // Build form params: required From/To and include OTP under multiple keys so flow can pick it up
    const params: Record<string, string> = {};
    if (fromNumber) params["From"] = String(fromNumber);
    params["To"] = String(input.phone);

    // If a specific flow is configured via secret or env, include it
    const flowSecret = await secrets.getCarrierFlow().catch(() => "");
    const flow = flowSecret || process.env.CARRIER_FLOW || process.env.EXOTEL_FLOW;
    if (flow) params["Flow"] = String(flow);

    // Provide the OTP under several common names so the Exotel Flow can reference it
    params["otpCode"] = String(input.otpCode);
    params["otp"] = String(input.otpCode);
    params["OTP"] = String(input.otpCode);

    // Also include requestId so provider/flow can correlate if needed
    params["requestId"] = String(input.requestId);

    const body = new URLSearchParams(params).toString();

    const resp = await fetch(exoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": auth
      },
      body
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`exotel error ${resp.status}: ${text}`);
    }

    const contentType = resp.headers.get("content-type") ?? "";
    let parsed: any = {};
    if (contentType.includes("application/json")) parsed = await resp.json();
    else {
      const t = await resp.text();
      try { parsed = JSON.parse(t); } catch { parsed = { raw: t }; }
    }

    const txn = parsed.CallSid ?? parsed.transactionId ?? parsed.id ?? parsed.txnId ?? parsed.raw ?? null;

    // Exotel may not immediately have duration; report queued/answered as 'queued' when no duration
    return {
      status: txn ? "answered" : "queued",
      durationSeconds: txn ? (parsed.durationSeconds ? Number(parsed.durationSeconds) : 45) : 0,
      providerId: this.id
    };
  }
}

export default ExotelProvider;
