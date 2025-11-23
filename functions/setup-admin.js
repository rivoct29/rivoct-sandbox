const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const firestore = admin.firestore();

async function createAdminUser() {
  const email = 'admin@rivoct.com';
  const password = 'Admin@123'; // Change this after first login
  
  try {
    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`✅ User already exists: ${email}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email: email,
          password: password,
          emailVerified: true,
          displayName: 'Admin User'
        });
        console.log(`✅ Created new user: ${email}`);
        console.log(`🔑 Temporary password: ${password}`);
        console.log(`⚠️  Please change password after first login!`);
      } else {
        throw error;
      }
    }

    // Create/update user document in Firestore with admin role
    const userRef = firestore.collection('users').doc(userRecord.uid);
    await userRef.set({
      uid: userRecord.uid,
      email: email,
      roles: ['admin'],
      customerId: userRecord.uid,
      status: 'active',
      emailVerified: true,
      package: 'ultra',
      displayName: 'Admin User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        signupMethod: 'admin-script',
        isOwner: true
      }
    }, { merge: true });

    console.log(`✅ Added admin role to user document`);

    // Create customer record
    const customerRef = firestore.collection('customers').doc(userRecord.uid);
    await customerRef.set({
      customerId: userRecord.uid,
      email: email,
      companyName: 'Rivoct Technologies',
      package: 'ultra',
      status: 'active',
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Created customer record`);
    console.log(`\n🎉 Admin account setup complete!`);
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`\n🌐 Login at: https://rivoct-sandbox.web.app/login`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
