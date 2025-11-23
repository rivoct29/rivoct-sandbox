const admin = require('firebase-admin');
const { createHash } = require('crypto');

const rawKey = process.argv[2];
if (!rawKey) {
  console.error('Usage: node delete_temp_api_key.js <rawApiKey>');
  process.exit(2);
}

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });
const db = admin.firestore();

function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

async function deleteKey() {
  const lookupHash = sha256(rawKey);
  const docRef = db.collection('api_keys').doc(lookupHash);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log('API key document not found for lookupHash:', lookupHash);
    process.exit(0);
  }

  await docRef.delete();
  console.log('Deleted api_keys document with id:', lookupHash);
}

deleteKey().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
