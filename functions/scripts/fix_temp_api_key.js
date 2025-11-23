const admin = require('firebase-admin');
const { createHash } = require('crypto');

const rawKey = process.argv[2];
if (!rawKey) {
  console.error('Usage: node fix_temp_api_key.js <rawApiKey>');
  process.exit(2);
}

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });
const db = admin.firestore();

function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

async function fixKey() {
  const lookupHash = sha256(rawKey);
  const salt = sha256(lookupHash).slice(0, 32); // deterministic salt for test
  const computedHash = sha256(`${salt}:${rawKey}`);

  const docRef = db.collection('api_keys').doc(lookupHash);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.error('Document not found for lookupHash:', lookupHash);
    process.exit(1);
  }

  await docRef.set({
    customerId: 'temporary_test_customer',
    userId: 'temp_user',
    salt,
    hash: computedHash,
    revoked: false,
    roles: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsed: null
  }, { merge: true });

  console.log('API key document updated to match verification schema.');
}

fixKey().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
