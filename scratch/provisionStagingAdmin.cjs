const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "aivi-campus-stg",
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function provisionAdmin() {
  const email = "staging.admin@aivicampus.com";
  const password = "AiviAdmin@2026!";
  const displayName = "AIVI Staging Platform Admin";

  console.log(`=== Provisioning Staging Admin: ${email} ===`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Found existing user with UID: ${userRecord.uid}. Updating credentials...`);
    userRecord = await auth.updateUser(userRecord.uid, {
      password,
      emailVerified: true,
      displayName,
    });
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      console.log(`Creating new user for ${email}...`);
      userRecord = await auth.createUser({
        email,
        password,
        emailVerified: true,
        displayName,
      });
      console.log(`Created user with UID: ${userRecord.uid}`);
    } else {
      throw err;
    }
  }

  // Set custom user claims for platform_admin
  const claims = {
    role: "platform_admin",
    tenantId: null,
    tenant_id: null,
    branchScope: [],
  };
  await auth.setCustomUserClaims(userRecord.uid, claims);
  console.log(`✅ Set Custom Claims:`, claims);

  // Set user_roles in Firestore
  await db.collection("user_roles").doc(userRecord.uid).set({
    role: "platform_admin",
    tenantId: null,
    email,
    displayName,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log(`✅ Set user_roles document for ${userRecord.uid}`);

  // Also set profile in Firestore
  await db.collection("profiles").doc(userRecord.uid).set({
    role: "platform_admin",
    email,
    displayName,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log(`✅ Set profiles document for ${userRecord.uid}`);

  console.log(`\n🎉 Staging Admin User Ready!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: platform_admin`);
}

provisionAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to provision admin:", err);
    process.exit(1);
  });
