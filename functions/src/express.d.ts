import type { AuthContext, RateLimitState } from "./types";

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
      rateLimits?: RateLimitState;
    }
  }
}

export {};
