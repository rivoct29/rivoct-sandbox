const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupMezzingo() {
  try {
    console.log('🚀 Setting up Mezzingo client...\n');

    // 1. Add customer document
    console.log('📝 Creating customer document...');
    await db.collection('customers').doc('midhun_test_001').set({
      id: 'midhun_test_001',
      name: 'Mezzingo',
      status: 'active',
      billingPlan: 'sandbox',
      apiKeyIds: [],
      createdAt: '2025-11-20T20:53:59Z'
    });
    console.log('✅ Customer created: midhun_test_001\n');

    // 2. Add API key document
    console.log('🔑 Creating API key document...');
    const apiKeyRef = await db.collection('api_keys').add({
      customerId: 'midhun_test_001',
      hash: '779f27df2f9d08e0e8d6eb71b65f1eca4db4b8087a94df5057db177ce29cb8b0',
      salt: 'slCWwSPivB7zn8O3beXrxdEaKmGJfQAy',
      createdAt: '2025-11-20T20:53:59Z',
      label: 'Production Key - 2025-11-21',
      revoked: false
    });
    const apiKeyId = apiKeyRef.id;
    console.log(`✅ API key created with ID: ${apiKeyId}\n`);

    // 3. Update customer with API key ID
    console.log('🔗 Linking API key to customer...');
    await db.collection('customers').doc('midhun_test_001').update({
      apiKeyIds: [apiKeyId]
    });
    console.log('✅ Customer updated with API key ID\n');

    // 4. Add usage counter document
    console.log('📊 Creating usage counter...');
    await db.collection('usage_counters').doc('midhun_test_001').set({
      customerId: 'midhun_test_001',
      minuteWindow: '2025-11-20T20:54',
      minuteCount: 0,
      dayWindow: '2025-11-20',
      dayCount: 0,
      monthWindow: '2025-11',
      monthCount: 0,
      totalCostInr: 0
    });
    console.log('✅ Usage counter created\n');

    console.log('========================================');
    console.log('✅ MEZZINGO SETUP COMPLETE!');
    console.log('========================================\n');
    console.log('📧 Client: midhun@mezzingo.com');
    console.log('🆔 Customer ID: midhun_test_001');
    console.log('🔑 API Key: qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB\n');
    console.log('✅ All Firestore documents added successfully!');
    console.log('📧 Now send the welcome email with the API key.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up Mezzingo:', error);
    process.exit(1);
  }
}

setupMezzingo();
