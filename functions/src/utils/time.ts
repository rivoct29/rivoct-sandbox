import { DateTime } from "luxon";
import * as admin from "firebase-admin";

export const nowUtc = (): DateTime => DateTime.utc();

export const minuteWindow = (dt: DateTime = nowUtc()): string => dt.toFormat("yyyyLLddHHmm");
export const dayWindow = (dt: DateTime = nowUtc()): string => dt.toFormat("yyyyLLdd");
export const monthWindow = (dt: DateTime = nowUtc()): string => dt.toFormat("yyyyLL");

/**
 * Calculate TTL timestamp for Firestore TTL policy
 * @param days Number of days until expiration
 * @returns Timestamp for the expiration date
 * 
 * Note: Firestore TTL policy uses server-side timestamps for deletion.
 * This helper calculates the target expiration date.
 */
export const ttl = (days: number): admin.firestore.Timestamp =>
  admin.firestore.Timestamp.fromDate(nowUtc().plus({ days }).toJSDate());

export const createdAtServer = (): admin.firestore.FieldValue =>
  admin.firestore.FieldValue.serverTimestamp();
