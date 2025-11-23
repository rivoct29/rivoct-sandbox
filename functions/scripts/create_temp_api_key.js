const admin = require('firebase-admin');
const crypto = require('crypto');

// Initialize Admin SDK - rely on ADC (gcloud / firebase CLI auth) used during deploy
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });

async function createTempKey() {
  const db = admin.firestore();

  // Generate key material
  const rawKey = `rvt_temp_${crypto.randomBytes(16).toString('hex')}`;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(rawKey, salt, 100000, 64, 'sha512').toString('hex');
  const lookupHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  // Minimal required fields (match production schema)
  const doc = {
    customerId: 'temporary_test_customer',
    userId: 'temp_user',
    hash,
    salt,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUsed: null
  };

  await db.collection('api_keys').doc(lookupHash).set(doc);

  console.log('Temporary API key created');
  console.log('x-api-key (use this header):', rawKey);
  console.log('Document ID (lookupHash):', lookupHash);
}

createTempKey()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to create temp API key:', err);
    process.exit(1);
  });
