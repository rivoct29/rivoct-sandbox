const admin = require('firebase-admin');

// Initialize with Application Default Credentials (works without service account key)
admin.initializeApp({
  projectId: 'rivoct-sandbox'
});

const firestore = admin.firestore();

async function grantAdminAccess() {
  const email = 'admin@rivoct.com';
  const uid = 'EBUQgXR4Q0RfgynGOrzVN71mWNP2';
  
  try {
    console.log('🔧 Granting full admin access...');

    // Update user document with all admin privileges
    const userRef = firestore.collection('users').doc(uid);
    await userRef.set({
      uid: uid,
      email: email,
      roles: ['admin', 'owner', 'superadmin'],
      customerId: uid,
      status: 'active',
      emailVerified: true,
      package: 'ultra',
      displayName: 'Admin User',
      permissions: {
        canManageUsers: true,
        canManageCustomers: true,
        canChangeOrgPolicies: true,
        canViewAllData: true,
        canManageBilling: true,
        canManageApiKeys: true,
        canAccessAdmin: true,
        isOwner: true,
        isSuperAdmin: true
      },
      metadata: {
        signupMethod: 'email',
        isOwner: true,
        isSuperAdmin: true,
        grantedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ User document updated with admin roles');

    // Create customer record
    const customerRef = firestore.collection('customers').doc(uid);
    await customerRef.set({
      customerId: uid,
      email: email,
      companyName: 'Rivoct Technologies',
      package: 'ultra',
      status: 'active',
      isAdmin: true,
      isOwner: true,
      permissions: {
        unlimited: true,
        noRateLimits: true
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Customer record created');

    // Set custom claims for Firebase Auth
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
      owner: true,
      superadmin: true,
      roles: ['admin', 'owner', 'superadmin']
    });

    console.log('✅ Custom claims set in Firebase Auth');

    console.log('\n🎉 Full admin access granted!');
    console.log('\n📧 Email: ' + email);
    console.log('🔑 UID: ' + uid);
    console.log('👑 Roles: admin, owner, superadmin');
    console.log('\n🌐 Login at: https://rivoct-sandbox.web.app/login');
    console.log('⚠️  You may need to log out and log back in for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

grantAdminAccess();
