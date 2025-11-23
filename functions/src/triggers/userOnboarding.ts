import * as functions from "firebase-functions/v1";
import { db } from "../utils/firestore";

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const customerId = user.uid;
  const email = user.email || "unknown";
  const name = user.displayName || email.split("@")[0];
  const now = new Date().toISOString();

  // Check if user document already exists (created by frontend)
  const userDoc = await db.collection("users").doc(user.uid).get();
  
  if (!userDoc.exists) {
    // Create user document if frontend didn't create it
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: email,
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1,
      customerId: customerId,
      status: "active",
      emailVerified: user.emailVerified || false,
      metadata: {
        signupMethod: user.providerData[0]?.providerId || "email",
        creationTime: user.metadata.creationTime,
      }
    });
  }

  // 1. Create Customer Profile
  await db.collection("customers").doc(customerId).set({
    id: customerId,
    name: name,
    email: email,
    status: "active",
    billingPlan: "sandbox",
    apiKeyIds: [],
    createdAt: now
  });

  // 2. Initialize Usage Counters (Zero State)
  const currentMonth = now.slice(0, 7); // YYYY-MM
  const currentDay = now.slice(0, 10);  // YYYY-MM-DD
  const currentMinute = now.slice(0, 16); // YYYY-MM-DDTHH:mm

  await db.collection("usage_counters").doc(customerId).set({
    customerId: customerId,
    minuteCount: 0,
    minuteWindow: currentMinute,
    dayCount: 0,
    dayWindow: currentDay,
    monthCount: 0,
    monthWindow: currentMonth,
    totalCostInr: 0
  });

  console.log(`[Onboarding] Successfully provisioned customer: ${customerId} (${email})`);
});
