import { secrets } from "../config";

type ActivateResult = {
  status: "success" | "error";
  carrierTxnId?: string;
  message?: string;
};

export class CarrierProvider {
  baseUrl: string;

  constructor(baseUrl?: string) {
    // allow override via env for testing
    this.baseUrl = baseUrl ?? process.env.CARRIER_API_BASE ?? "https://api.carrier.example";
  }

  async activateService(customerId: string, planId?: string, rawPayload?: Record<string, any>): Promise<ActivateResult> {
    const apiKey = await secrets.getCarrierApiKey();
    const clientId = await secrets.getCarrierClientId();

    if (!apiKey) {
      return { status: "error", message: "missing carrier API key" };
    }

    const url = `${this.baseUrl}/v1/activate`;

    try {
      // Exotel integration: if baseUrl or env indicates Exotel, use Basic auth
      // Detect Exotel when baseUrl contains 'exotel', or env flag set, or when we have a clientId and API key in username:token form
      const isExotel = (this.baseUrl || "").includes("exotel") || (process.env.CARRIER_TYPE === "exotel") || ((clientId ?? "") !== "" && (apiKey.includes(":")));

      let resp: Response;
      if (isExotel) {
        // Exotel expects Basic auth using API key (username:token) and account SID in path
        // The CARRIER_API_KEY secret is stored as `username:token` (or just token).
        const [username, token] = apiKey.split(":");
        const accountSid = process.env.CARRIER_ACCOUNT_SID ?? clientId ?? "";
        if (!accountSid) return { status: "error", message: "missing carrier account SID" };

        const exoUrl = `${this.baseUrl.replace(/\/$/, "")}/v1/Accounts/${accountSid}/Calls/connect`;

        // Prefer values from rawPayload when present (Midhun will provide payload)
        const fromNumber = rawPayload?.From ?? rawPayload?.from ?? process.env.CARRIER_FROM_NUMBER ?? process.env.EXOTEL_FROM ?? "";
        const toNumber = rawPayload?.To ?? rawPayload?.to ?? customerId ?? "";
        const flow = rawPayload?.Flow ?? rawPayload?.flow ?? process.env.CARRIER_FLOW ?? process.env.EXOTEL_FLOW ?? undefined;

        const params: Record<string, string> = {};
        if (fromNumber) params["From"] = String(fromNumber);
        if (toNumber) params["To"] = String(toNumber);
        if (flow) params["Flow"] = String(flow);

        const body = new URLSearchParams(params).toString();

        const auth = username && token ? `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}` : `Basic ${Buffer.from(`:${apiKey}`).toString("base64")}`;

        resp = await fetch(exoUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": auth
          },
          body
        });
      } else {
        // Non-Exotel carriers: pass JSON. If rawPayload exists, pass it through.
        const payload = rawPayload ?? { customerId, planId };
        resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "X-Client-Id": clientId ?? ""
          },
          body: JSON.stringify(payload)
        });
      }

      if (!resp.ok) {
        const text = await resp.text();
        return { status: "error", message: `carrier error ${resp.status}: ${text}` };
      }

      const contentType = resp.headers.get('content-type') ?? '';
      let body: any = {};
      if (contentType.includes('application/json')) {
        body = await resp.json();
      } else {
        const text = await resp.text();
        try { body = JSON.parse(text); } catch { body = { raw: text }; }
      }
      // normalize expected fields; tolerant to different carrier responses
      const txn = body.transactionId ?? body.txnId ?? body.id ?? body.CallSid ?? body.raw ?? null;

      return { status: "success", carrierTxnId: txn ?? undefined };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { status: "error", message };
    }
  }
}

export default CarrierProvider;
