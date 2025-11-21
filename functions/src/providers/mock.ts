import { db } from "../utils/firestore";
import { createdAtServer, ttl } from "../utils/time";
import type { IVoiceProvider, VoiceProviderInput, VoiceProviderResult } from "./interface";

const events = db.collection("webhook_events");

/**
 * Generate realistic voice OTP call duration (30-60 seconds)
 * Simulates typical IVR flow: greeting + OTP digits + confirmation
 */
const randomDuration = (): number => {
  // Min: 30s (fast call), Max: 60s (with retries/delays)
  return 30 + Math.floor(Math.random() * 31);
};

export class MockProvider implements IVoiceProvider {
  id = "mock-mcm";

  async placeCall(input: VoiceProviderInput): Promise<VoiceProviderResult> {
    const durationSeconds = randomDuration();
    const status = "answered" as const;
    
    await events.add({
      requestId: input.requestId,
      customerId: input.customerId,
      payload: {
        phone: input.phone,
        otpCode: input.otpCode
      },
      status,
      durationSeconds,
      provider: this.id,
      createdAt: createdAtServer(),
      expiresAt: ttl(60)
    });

    return { 
        status, 
        durationSeconds,
        providerId: this.id
    };
  }
}
