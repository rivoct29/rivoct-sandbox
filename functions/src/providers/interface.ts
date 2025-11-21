export interface VoiceProviderInput {
  phone: string;
  otpCode: string;
  customerId: string;
  requestId: string;
}

export interface VoiceProviderResult {
  status: "answered" | "failed" | "queued";
  durationSeconds: number;
  providerId: string;
}

export interface IVoiceProvider {
  id: string;
  placeCall(input: VoiceProviderInput): Promise<VoiceProviderResult>;
}
