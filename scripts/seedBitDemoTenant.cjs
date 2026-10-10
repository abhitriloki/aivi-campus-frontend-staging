const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function seedTenant() {
  console.log("Seeding bit-demo tenant in Firestore...");
  const tenantRef = db.collection("tenants").doc("bit-demo");
  await tenantRef.set({
    name: "Bhilai Institute of Technology - Sandbox",
    slug: "bit-demo",
    logoUrl: "https://aivilabs.com/brand/aivi-logo-dark.svg",
    primaryColor: "#FF6D4A",
    domain: "bit.aivilabs.com",
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log("✅ Successfully seeded tenant 'bit-demo'!");
}

if (require.main === module) {
  seedTenant().catch(console.error);
}

module.exports = { seedTenant };
