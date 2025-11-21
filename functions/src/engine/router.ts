import { v4 as uuid } from "uuid";
import { config } from "../config";
import { MockProvider } from "../providers/mock";
import { recordVoiceLog } from "../services/logService";
import { UsageService } from "../services/usageService";
import { CustomerService } from "../services/customerService";
import type { VoiceOtpResponseDTO } from "../shared";

interface SendOtpInput {
  customerId: string;
  phone: string;
  otpCode: string;
  metadata?: Record<string, unknown>;
}

export class OtpRouter {
  static async routeAndSend(input: SendOtpInput): Promise<VoiceOtpResponseDTO> {
    // 1. Select Provider (Simple for now)
    const provider = new MockProvider();

    // 2. Prepare Request
    await CustomerService.ensureActive(input.customerId);
    const requestId = uuid();

    // 3. Execute
    const result = await provider.placeCall({
      phone: input.phone,
      otpCode: input.otpCode,
      customerId: input.customerId,
      requestId
    });

    // 4. Record & Bill
    await recordVoiceLog({
      customerId: input.customerId,
      phone: input.phone,
      otpCode: input.otpCode,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
      durationSeconds: result.durationSeconds,
      pricingInr: config.pricing.perCallInr,
      requestId,
      status: result.status
    });

    await UsageService.recordBilling(
      input.customerId,
      requestId,
      config.pricing.perCallInr,
      result.status
    );

    return {
      requestId,
      status: result.status,
      durationSeconds: result.durationSeconds,
      billedAmountInr: config.pricing.perCallInr
    };
  }
}
