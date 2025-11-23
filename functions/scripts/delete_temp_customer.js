const admin = require('firebase-admin');

const customerId = process.argv[2] || 'temporary_test_customer';

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });
const db = admin.firestore();

async function deleteCustomer() {
  const docRef = db.collection('customers').doc(customerId);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log('Customer document not found:', customerId);
    process.exit(0);
  }

  await docRef.delete();
  console.log('Deleted customers document with id:', customerId);
}

deleteCustomer().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
