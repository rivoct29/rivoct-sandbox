// Inlined from @rivoct/shared to avoid workspace dependency issues during deployment

export type VoiceOtpStatus = "queued" | "answered" | "failed";

export interface VoiceOtpRequestDTO {
  customerId: string;
  phone: string;
  otpCode: string;
  metadata?: Record<string, unknown>;
}

export interface VoiceOtpResponseDTO {
  requestId: string;
  status: VoiceOtpStatus;
  durationSeconds: number;
  billedAmountInr: number;
}

export interface VoiceLogEntry {
  id?: string;
  customerId: string;
  phone: string;
  otpCode: string;
  createdAt: string | Date | Record<string, unknown>;
  updatedAt?: string | Date | Record<string, unknown>;
  status: VoiceOtpStatus;
  requestId: string;
  durationSeconds: number;
  metadata?: Record<string, unknown>;
  pricingInr: number;
  expiresAt?: string | Date | Record<string, unknown>;
  deliveredAt?: string | Date | Record<string, unknown>;
}

export interface UsageSummaryDTO {
  customerId: string;
  minuteCount: number;
  dayCount: number;
  monthCount: number;
  minuteLimit: number;
  dayLimit: number;
  monthLimit: number;
  totalCostInr: number;
  updatedAt?: string;
}

export interface ApiKeyRecord {
  id?: string;
  customerId: string;
  hash: string;
  salt: string;
  createdAt: string;
  revoked: boolean;
  label?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  status: "active" | "suspended";
  createdAt: string;
  apiKeyIds: string[];
  billingPlan: "sandbox" | "paid";
}

const INDIA_PHONE_REGEX = /^\+91[1-9]\d{9}$/;

export const isValidIndiaPhone = (phone: string): boolean => INDIA_PHONE_REGEX.test(phone.trim());

export const maskApiKey = (key: string): string => {
  if (key.length <= 6) return "***";
  return `${key.slice(0, 3)}****${key.slice(-3)}`;
};

export const assertIndiaPhone = (phone: string): void => {
  if (!isValidIndiaPhone(phone)) {
    throw new Error("Phone number must be an India (+91) MSISDN with 10 digits");
  }
};

export const isTenantScoped = (customerIdFromToken: string, targetCustomerId: string): boolean =>
  customerIdFromToken === targetCustomerId;
