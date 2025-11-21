
const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// const serviceAccount = require('../firebase-admin-key.json');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'rivoct-sandbox'
});

const db = admin.firestore();

async function main() {
  try {
    // Read the raw API key
    const keyData = JSON.parse(fs.readFileSync(path.join(__dirname, '../api_key_midhun_test_001.json'), 'utf8'));
    const apiKey = keyData.apiKey;

    // Read the metadata (salt, hash, etc.)
    const metaData = JSON.parse(fs.readFileSync(path.join(__dirname, '../temp_api_key.json'), 'utf8'));

    // Calculate Lookup Hash (Document ID)
    const lookupHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    console.log(`API Key: ${apiKey}`);
    console.log(`Lookup Hash (Doc ID): ${lookupHash}`);
    console.log(`Verification Hash: ${metaData.hash}`);
    console.log(`Salt: ${metaData.salt}`);

    // Write to Firestore
    await db.collection('api_keys').doc(lookupHash).set(metaData);
    console.log('✅ API Key successfully written to Firestore');

    // Update credentials file for smoke test
    const creds = {
        apiKey: apiKey,
        hash: metaData.hash,
        salt: metaData.salt,
        timestamp: new Date().toISOString()
    };
    fs.writeFileSync(path.join(__dirname, '../midhun_mezzingo_credentials.json'), JSON.stringify(creds, null, 2));
    console.log('✅ Credentials file updated');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
