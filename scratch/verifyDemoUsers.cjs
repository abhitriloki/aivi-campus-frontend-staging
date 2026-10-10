const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "aivi-career",
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function fixUsers() {
  const usersToVerify = [
    { email: "director.tpo@sunrise.ac.in", role: "tenant_admin", tenantId: "demo-sunrise" },
    { email: "tpo.director@demo.aivilabs.com", role: "tenant_admin", tenantId: "demo-sunrise" },
    { email: "tpo@sunrise.ac.in", role: "tenant_admin", tenantId: "demo-sunrise" },
    { email: "coordinator.cse@demo.aivilabs.com", role: "coordinator", tenantId: "demo-sunrise", branchScope: ["CSE", "IT"] },
    { email: "abhishek@sunrise.ac.in", role: "student", tenantId: "demo-sunrise", branchScope: ["CSE"] },
    { email: "aarav.sharma@sunrise.ac.in", role: "student", tenantId: "demo-sunrise", branchScope: ["CSE"] },
    { email: "student1@demo.aivilabs.com", role: "student", tenantId: "demo-sunrise", branchScope: ["CSE"] },
    { email: "admin@aivilabs.com", role: "platform_admin", tenantId: null },
    { email: "abhi.triloki@gmail.com", role: "platform_admin", tenantId: null },
  ];

  console.log("=== Updating Demo Users in Firebase Auth & Firestore ===");

  for (const item of usersToVerify) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(item.email);
      } catch (err) {
        userRecord = await auth.createUser({
          email: item.email,
          password: "Password@123",
          emailVerified: true,
          displayName: item.role === "tenant_admin" ? "Dr. Alok Verma" : item.role === "coordinator" ? "Prof. Sunita Rao" : "Aarav Sharma",
        });
        console.log(`Created user: ${item.email} (UID: ${userRecord.uid})`);
      }

      await auth.updateUser(userRecord.uid, {
        emailVerified: true,
      });

      const claims = {
        role: item.role,
        tenantId: item.tenantId,
        tenant_id: item.tenantId,
        branchScope: item.branchScope || [],
      };

      await auth.setCustomUserClaims(userRecord.uid, claims);

      await db.collection("user_roles").doc(userRecord.uid).set({
        role: item.role,
        tenantId: item.tenantId,
        email: item.email,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ VERIFIED & CLAIMS SET for ${item.email} (${item.role})`);
    } catch (e) {
      console.error(`❌ Error on ${item.email}:`, e.message);
    }
  }
}

fixUsers().then(() => {
  console.log("=== Finished user verification ===");
  process.exit(0);
}).catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
