import { createHash, randomBytes } from "crypto";

export const sha256 = (input: string): string =>
  createHash("sha256").update(input).digest("hex");

export const deriveLookupHash = (apiKey: string): string => sha256(apiKey);

export const hashWithSalt = (apiKey: string, salt: string): string => sha256(`${salt}:${apiKey}`);

export const generateSalt = (): string => randomBytes(16).toString("hex");
