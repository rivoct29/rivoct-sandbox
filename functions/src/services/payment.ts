import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

interface PaymentVerificationData {
  userId: string;
  packageId: "basic" | "premium" | "ultra";
  transactionId: string;
  amount: number;
}

interface PackageConfig {
  name: string;
  monthlyBase: number;
  pricePerMinute: number;
  includedMinutes: number;
  rateLimit: number;
  features: {
    webhooks: boolean;
    customCallerId: boolean;
    fraudDetection: boolean;
    flashCallFallback: boolean;
    dedicatedSupport: boolean;
  };
}

const PACKAGE_CONFIGS: Record<string, PackageConfig> = {
  basic: {
    name: "Rivoct Basic",
    monthlyBase: 999,
    pricePerMinute: 0.40,
    includedMinutes: 5000,
    rateLimit: 100,
    features: {
      webhooks: false,
      customCallerId: false,
      fraudDetection: false,
      flashCallFallback: false,
      dedicatedSupport: false
    }
  },
  premium: {
    name: "Rivoct Premium",
    monthlyBase: 4999,
    pricePerMinute: 0.35,
    includedMinutes: 20000,
    rateLimit: 500,
    features: {
      webhooks: true,
      customCallerId: true,
      fraudDetection: true,
      flashCallFallback: false,
      dedicatedSupport: false
    }
  },
  ultra: {
    name: "Rivoct Ultra",
    monthlyBase: 14999,
    pricePerMinute: 0.30,
    includedMinutes: 75000,
    rateLimit: 0, // unlimited
    features: {
      webhooks: true,
      customCallerId: true,
      fraudDetection: true,
      flashCallFallback: true,
      dedicatedSupport: true
    }
  }
};

// Wholesale cost (CONFIDENTIAL - never exposed to client)
const WHOLESALE_COST_PER_MINUTE = 0.25;

export const verifyPaymentAndActivate = functions.https.onCall(
  { region: "asia-south1" },
  async (request) => {
    const data = request.data as PaymentVerificationData;
    const { userId, packageId, transactionId, amount } = data;

    // Validate input
    if (!userId || !packageId || !transactionId || !amount) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    const packageConfig = PACKAGE_CONFIGS[packageId];
    if (!packageConfig) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid package ID"
      );
    }

    // Verify amount matches package price
    if (amount !== packageConfig.monthlyBase) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Amount mismatch"
      );
    }

    const db = admin.firestore();

    try {
      // 1. Check if transaction already processed
      const existingPayment = await db
        .collection("payments")
        .where("transactionId", "==", transactionId)
        .limit(1)
        .get();

      if (!existingPayment.empty) {
        throw new functions.https.HttpsError(
          "already-exists",
          "Transaction already processed"
        );
      }

      // 2. Record payment
      const paymentRef = db.collection("payments").doc();
      await paymentRef.set({
        userId,
        packageId,
        transactionId,
        amount,
        status: "verified",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Get or create customer document
      const customerRef = db.collection("customers").doc(userId);
      const customerSnap = await customerRef.get();

      let customerId: string;
      if (!customerSnap.exists) {
        // New customer - generate customer ID
        customerId = `cust_${userId.substring(0, 8)}_${Date.now()}`;
        
        await customerRef.set({
          customerId,
          userId,
          package: packageId,
          packageConfig: {
            name: packageConfig.name,
            pricePerMinute: packageConfig.pricePerMinute,
            includedMinutes: packageConfig.includedMinutes,
            rateLimit: packageConfig.rateLimit,
            features: packageConfig.features
          },
          billing: {
            currentPeriodStart: admin.firestore.Timestamp.now(),
            currentPeriodEnd: admin.firestore.Timestamp.fromDate(
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            ),
            status: "active"
          },
          usage: {
            minutesUsed: 0,
            minutesIncluded: packageConfig.includedMinutes,
            overageMinutes: 0
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // Existing customer - update package
        const existingData = customerSnap.data();
        customerId = existingData?.customerId || `cust_${userId.substring(0, 8)}_${Date.now()}`;
        
        await customerRef.update({
          package: packageId,
          packageConfig: {
            name: packageConfig.name,
            pricePerMinute: packageConfig.pricePerMinute,
            includedMinutes: packageConfig.includedMinutes,
            rateLimit: packageConfig.rateLimit,
            features: packageConfig.features
          },
          "billing.currentPeriodStart": admin.firestore.Timestamp.now(),
          "billing.currentPeriodEnd": admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ),
          "billing.status": "active",
          "usage.minutesUsed": 0,
          "usage.minutesIncluded": packageConfig.includedMinutes,
          "usage.overageMinutes": 0,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // 4. Generate API key if doesn't exist
      const apiKeysSnap = await db
        .collection("api_keys")
        .where("customerId", "==", customerId)
        .where("active", "==", true)
        .limit(1)
        .get();

      let apiKey: string;
      if (apiKeysSnap.empty) {
        // Generate new API key (similar to existing implementation)
        const rawKey = `rvt_live_${crypto.randomBytes(24).toString("hex")}`;
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.pbkdf2Sync(rawKey, salt, 100000, 64, "sha512").toString("hex");
        const lookupHash = crypto.createHash("sha256").update(rawKey).digest("hex");
        
        apiKey = rawKey;

        await db.collection("api_keys").doc(lookupHash).set({
          customerId,
          userId,
          hash,
          salt,
          active: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUsed: null
        });
      } else {
        // API key already exists (shouldn't show actual key for security)
        apiKey = "existing_key";
      }

      // 5. Get user email for welcome email
      const userRecord = await admin.auth().getUser(userId);
      const userEmail = userRecord.email;

      // 6. Send welcome email (placeholder - implement actual email service)
      if (userEmail) {
        await sendWelcomeEmail({
          email: userEmail,
          name: userRecord.displayName || userEmail.split("@")[0],
          packageName: packageConfig.name,
          apiKey: apiKey !== "existing_key" ? apiKey : "Check your dashboard",
          customerId
        });
      }

      return {
        success: true,
        customerId,
        package: packageId,
        apiKeyGenerated: apiKey !== "existing_key",
        message: "Payment verified and account activated"
      };

    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Payment verification failed"
      );
    }
  }
);

// Email sending function (implement with SendGrid, Mailgun, or similar)
async function sendWelcomeEmail(data: {
  email: string;
  name: string;
  packageName: string;
  apiKey: string;
  customerId: string;
}) {
  // TODO: Implement actual email sending
  // For now, just log
  console.log("Welcome email would be sent:", {
    to: data.email,
    subject: `Welcome to ${data.packageName}!`,
    apiKey: data.apiKey,
    customerId: data.customerId
  });

  // Example SendGrid implementation:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: data.email,
    from: 'noreply@rivoct.com',
    subject: `Welcome to ${data.packageName}!`,
    html: generateWelcomeEmailHTML(data)
  });
  */
}

// Calculate margin (for internal analytics only - never exposed)
export function calculateMargin(packageTier: string, minutes: number): number {
  const config = PACKAGE_CONFIGS[packageTier];
  if (!config) return 0;

  const revenue = minutes * config.pricePerMinute;
  const cost = minutes * WHOLESALE_COST_PER_MINUTE;
  return revenue - cost;
}
