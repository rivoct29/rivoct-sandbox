import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const PROJECT_ID = "rivoct-sandbox";
let SM_CLIENT: SecretManagerServiceClient | null = null;

function getSecretManagerClient(): SecretManagerServiceClient {
  if (!SM_CLIENT) {
    SM_CLIENT = new SecretManagerServiceClient();
  }
  return SM_CLIENT;
}

async function accessSecret(secretName: string): Promise<string> {
  try {
    const client = getSecretManagerClient();
    const [version] = await client.accessSecretVersion({
      name: `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`
    });
    return version.payload?.data?.toString() ?? "";
  } catch (err) {
    console.error("accessSecret failed", secretName, err);
    return "";
  }
}

// cached getters
let _apiSalt = "";
let _webhookSecret = "";
let _internalToken = "";

export const secrets = {
  getApiSalt: async () => {
    if (!_apiSalt) _apiSalt = await accessSecret("SECRET_API_SALT");
    return _apiSalt;
  },
  getWebhookSecret: async () => {
    if (!_webhookSecret) _webhookSecret = await accessSecret("SECRET_WEBHOOK");
    return _webhookSecret;
  },
  getInternalToken: async () => {
    if (!_internalToken) _internalToken = await accessSecret("INTERNAL_BACKEND_TOKEN");
    return _internalToken;
  }
};

export const config = {
  projectId: "rivoct-sandbox",
  region: "asia-south1",
  rateLimit: {
    minute: Number(process.env.RIVOCT_RATE_LIMIT_MINUTE ?? 5),
    day: Number(process.env.RIVOCT_RATE_LIMIT_DAY ?? 100),
    month: Number(process.env.RIVOCT_RATE_LIMIT_MONTH ?? 1000)
  },
  pricing: {
    perCallInr: Number(process.env.RIVOCT_PRICING_PER_CALL ?? 0.32)
  },
  webhook: {
    url: process.env.RIVOCT_WEBHOOK_URL ?? ""
  }
};
