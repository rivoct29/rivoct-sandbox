import { firestore } from "firebase-admin";
import { db } from "../utils/firestore";
import { dayWindow, minuteWindow, monthWindow, nowUtc, ttl } from "../utils/time";
import { config } from "../config";

interface UsageDoc {
  customerId: string;
  minuteWindow: string;
  minuteCount: number;
  dayWindow: string;
  dayCount: number;
  monthWindow: string;
  monthCount: number;
  totalCostInr: number;
  updatedAt: firestore.Timestamp;
  expiresAt: firestore.Timestamp;
}

const counters = db.collection("usage_counters");
const billing = db.collection("billing");

interface BillingLineItemDoc {
  requestId: string;
  amountInr: number;
  status: string;
  createdAt: string;
}

interface BillingDoc {
  customerId: string;
  cycle: string;
  totalCalls: number;
  totalCostInr: number;
  lineItems: BillingLineItemDoc[];
  updatedAt: firestore.Timestamp;
}

export interface RateLimits {
  minute: number;
  day: number;
  month: number;
}

export class UsageService {
  static async reserveQuota(customerId: string): Promise<UsageDoc> {
    const limits: RateLimits = config.rateLimit;
    const docRef = counters.doc(customerId);
    const currentMinute = minuteWindow();
    const currentDay = dayWindow();
    const currentMonth = monthWindow();
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const base: UsageDoc = snap.exists
        ? (snap.data() as UsageDoc)
        : {
            customerId,
            minuteWindow: currentMinute,
            minuteCount: 0,
            dayWindow: currentDay,
            dayCount: 0,
            monthWindow: currentMonth,
            monthCount: 0,
            totalCostInr: 0,
            updatedAt: firestore.Timestamp.now(),
            expiresAt: ttl(90)
          };

      if (base.minuteWindow !== currentMinute) {
        base.minuteWindow = currentMinute;
        base.minuteCount = 0;
      }
      if (base.dayWindow !== currentDay) {
        base.dayWindow = currentDay;
        base.dayCount = 0;
      }
      if (base.monthWindow !== currentMonth) {
        base.monthWindow = currentMonth;
        base.monthCount = 0;
      }

      if (base.minuteCount + 1 > limits.minute) {
        throw new Error("RATE_LIMIT_MINUTE_EXCEEDED");
      }
      if (base.dayCount + 1 > limits.day) {
        throw new Error("RATE_LIMIT_DAY_EXCEEDED");
      }
      if (base.monthCount + 1 > limits.month) {
        throw new Error("RATE_LIMIT_MONTH_EXCEEDED");
      }

      base.minuteCount += 1;
      base.dayCount += 1;
      base.monthCount += 1;
      base.updatedAt = firestore.Timestamp.now();
      base.expiresAt = ttl(90);

      tx.set(docRef, base, { merge: false });
      return base;
    });
  }

  static async getUsageSummary(customerId: string): Promise<UsageDoc> {
    const docRef = counters.doc(customerId);
    const snap = await docRef.get();
    if (!snap.exists) {
      return {
        customerId,
        minuteWindow: minuteWindow(),
        minuteCount: 0,
        dayWindow: dayWindow(),
        dayCount: 0,
        monthWindow: monthWindow(),
        monthCount: 0,
        totalCostInr: 0,
        updatedAt: firestore.Timestamp.now(),
        expiresAt: ttl(90)
      };
    }
    return snap.data() as UsageDoc;
  }

  static async recordBilling(
    customerId: string,
    requestId: string,
    amountInr: number,
    status: string
  ): Promise<void> {
    const cycle = nowUtc().toFormat("yyyy-LL");
    const docId = `${customerId}_${cycle}`;
    const docRef = billing.doc(docId);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      let base: BillingDoc;
      if (snap.exists) {
        base = snap.data() as BillingDoc;
      } else {
        base = {
          customerId,
          cycle,
          totalCalls: 0,
          totalCostInr: 0,
          lineItems: [],
          updatedAt: firestore.Timestamp.now()
        };
      }
      const createdAtIso = nowUtc().toISO() ?? new Date().toISOString();
      const newLine: BillingLineItemDoc = {
        requestId,
        amountInr,
        status,
        createdAt: createdAtIso
      };
      base.totalCalls += 1;
      base.totalCostInr = Number((base.totalCostInr + amountInr).toFixed(4));
      base.lineItems = [...base.lineItems.slice(-99), newLine];
      base.updatedAt = firestore.Timestamp.now();
      tx.set(docRef, base, { merge: false });
    });

    const usageDoc = counters.doc(customerId);
    await usageDoc.set(
      {
        totalCostInr: firestore.FieldValue.increment(amountInr),
        updatedAt: firestore.Timestamp.now()
      },
      { merge: true }
    );
  }
}
