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

export interface WebhookDeliveryPayload {
  requestId: string;
  status: VoiceOtpStatus;
  durationSeconds: number;
  deliveredAt: string;
  meta?: Record<string, unknown>;
}

export interface BillingLineItem {
  requestId: string;
  amountInr: number;
  status: VoiceOtpStatus;
  createdAt: string;
}

export interface BillingDocument {
  id?: string;
  customerId: string;
  cycle: string;
  totalCalls: number;
  totalCostInr: number;
  lineItems: BillingLineItem[];
  updatedAt: string;
}
