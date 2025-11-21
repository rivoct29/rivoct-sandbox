import { firestore } from "firebase-admin";
import type { VoiceLogEntry, VoiceOtpStatus } from "../shared.js";
import { db } from "../utils/firestore";
import { createdAtServer, ttl } from "../utils/time";

const collection = db.collection("voice_logs") as firestore.CollectionReference<VoiceLogEntry>;
const phoneHistory = db.collection("phone_history");

export const recordVoiceLog = async (log: VoiceLogEntry): Promise<string> => {
  const payload = {
    ...log,
    createdAt: createdAtServer(),
    expiresAt: ttl(60)
  };
  const docRef = await collection.add(payload);
  await phoneHistory.doc(`${log.customerId}_${log.phone}`).set(
    {
      customerId: log.customerId,
      phone: log.phone,
      lastUsedAt: createdAtServer(),
      expiresAt: ttl(30)
    },
    { merge: true }
  );
  return docRef.id;
};

export const updateVoiceLogStatus = async (
  customerId: string,
  requestId: string,
  updates: Partial<Pick<VoiceLogEntry, "status" | "durationSeconds">>
): Promise<void> => {
  const query = await collection
    .where("customerId", "==", customerId)
    .where("requestId", "==", requestId)
    .limit(1)
    .get();
  if (query.empty) {
    throw new Error("VOICE_LOG_NOT_FOUND");
  }
  const doc = query.docs[0];
  await doc.ref.set({ ...updates, updatedAt: firestore.Timestamp.now() }, { merge: true });
};

export interface FetchLogsOptions {
  limit?: number;
  status?: VoiceOtpStatus;
}

export const fetchLogs = async (
  customerId: string,
  { limit = 50, status }: FetchLogsOptions
): Promise<VoiceLogEntry[]> => {
  let ref: firestore.Query<VoiceLogEntry> = collection.where("customerId", "==", customerId);
  if (status) {
    ref = ref.where("status", "==", status);
  }
  const snap = await ref.orderBy("createdAt", "desc").limit(Math.min(limit, 200)).get();
  return snap.docs.map((doc: firestore.QueryDocumentSnapshot<VoiceLogEntry>) => ({ id: doc.id, ...doc.data() }));
};
