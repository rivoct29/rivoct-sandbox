import type { Request } from "express";
import type { UsageSummaryDTO } from "./shared.js";

export interface AuthContext {
  customerId: string;
  apiKeyId: string;
  roles: string[];
}

export interface RateLimitState {
  minuteCount: number;
  dayCount: number;
  monthCount: number;
  minuteLimit: number;
  dayLimit: number;
  monthLimit: number;
}

export interface RequestWithContext extends Request {
  authContext?: AuthContext;
  rateLimits?: RateLimitState;
}

export type UsageSummaryWithCost = UsageSummaryDTO;

export interface ApiErrorShape {
  error: string;
  code: string;
  details?: unknown;
}
