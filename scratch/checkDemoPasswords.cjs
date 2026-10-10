const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "aivi-career",
  });
}

const auth = admin.auth();

async function check() {
  const emails = [
    "tpo.director@demo.aivilabs.com",
    "coordinator.cse@demo.aivilabs.com",
    "student1@demo.aivilabs.com",
    "admin@aivilabs.com",
  ];

  console.log("--- Checking Firebase Auth Users ---");
  for (const email of emails) {
    try {
      const user = await auth.getUserByEmail(email);
      console.log(`✅ FOUND: ${email} | UID: ${user.uid} | Disabled: ${user.disabled} | EmailVerified: ${user.emailVerified} | CustomClaims:`, user.customClaims);
    } catch (e) {
      console.log(`❌ NOT FOUND in Firebase Auth: ${email} (${e.message})`);
    }
  }
}

check().catch(console.error);
