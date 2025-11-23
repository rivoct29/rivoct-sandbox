const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });
const db = admin.firestore();

function randomDuration() {
  return 30 + Math.floor(Math.random() * 31);
}

function nowIso() {
  return new Date().toISOString();
}

function monthCycle() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function ensureCustomer(id) {
  const ref = db.collection('customers').doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({ status: 'active', name: 'Temporary Test Customer', billingPlan: 'basic', createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log('Created temp customer', id);
  } else {
    console.log('Customer exists:', id);
  }
}

async function run(phone, otp, customerId = 'temporary_test_customer') {
  console.log('Simulating Midhun -> our API -> MockProvider');
  console.log('Payload:', { phone, otpCode: otp, customerId });

  // ensure customer
  await ensureCustomer(customerId);

  const requestId = crypto.randomUUID();

  // MockProvider.placeCall: write webhook_events
  const duration = randomDuration();
  const status = 'answered';
  await db.collection('webhook_events').add({
    requestId,
    customerId,
    payload: { phone, otpCode: otp },
    status,
    durationSeconds: duration,
    provider: 'mock-mcm',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 60 * 1000)
  });
  console.log('MockProvider: webhook_events created');

  // recordVoiceLog (mimic recordVoiceLog)
  const voiceLog = {
    customerId,
    phone,
    otpCode: otp,
    metadata: {},
    createdAt: nowIso(),
    durationSeconds: duration,
    pricingInr: 0.32,
    requestId,
    status
  };
  await db.collection('voice_logs').add({ ...voiceLog, createdAt: admin.firestore.FieldValue.serverTimestamp(), expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 60 * 1000) });
  await db.collection('phone_history').doc(`${customerId}_${phone}`).set({ customerId, phone, lastUsedAt: admin.firestore.FieldValue.serverTimestamp(), expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000) }, { merge: true });
  console.log('Recorded voice log');

  // record billing (simple append)
  const cycle = monthCycle();
  const docId = `${customerId}_${cycle}`;
  const billingRef = db.collection('billing').doc(docId);
  const billingSnap = await billingRef.get();
  const amount = 0.32;
  if (!billingSnap.exists) {
    await billingRef.set({ customerId, cycle, totalCalls: 1, totalCostInr: amount, lineItems: [{ requestId, amountInr: amount, status, createdAt: nowIso() }], updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  } else {
    const data = billingSnap.data();
    const items = (data.lineItems || []).slice(-99).concat([{ requestId, amountInr: amount, status, createdAt: nowIso() }]);
    await billingRef.set({ customerId, cycle, totalCalls: (data.totalCalls || 0) + 1, totalCostInr: Number(((data.totalCostInr || 0) + amount).toFixed(4)), lineItems: items, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  }
  console.log('Recorded billing line item');

  // update usage counter simple increment
  const countersRef = db.collection('usage_counters').doc(customerId);
  await countersRef.set({ totalCostInr: admin.firestore.FieldValue.increment(amount), updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

  // Print the payload that would be sent to Exotel (but we won't call it)
  const exotelPayload = {
    From: '<carrier from number in secret>',
    To: phone,
    Flow: '<configured flow>',
    otpCode: otp,
    otp: otp,
    OTP: otp,
    requestId
  };

  console.log('Simulated Exotel payload (not sent):');
  console.log(JSON.stringify(exotelPayload, null, 2));

  console.log('E2E Mock simulation complete. RequestId:', requestId);
}

const args = process.argv.slice(2);
const phone = args[0] || '+917736425590';
const otp = args[1] || '6161';
run(phone, otp).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
