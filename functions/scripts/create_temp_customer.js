const admin = require('firebase-admin');

admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT_ID || 'rivoct-sandbox' });
const db = admin.firestore();

async function createCustomer() {
  const id = 'temporary_test_customer';
  await db.collection('customers').doc(id).set({
    status: 'active',
    name: 'Temporary Test Customer',
    billingPlan: 'basic',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Temporary customer created with id:', id);
}

createCustomer().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
