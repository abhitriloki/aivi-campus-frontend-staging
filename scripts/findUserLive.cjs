const admin = require("./liveFirebaseAdmin.cjs");

const db = admin.firestore();
const uid = process.argv[2];

if (!uid) {
    console.error("Usage: node scripts/findUserLive.cjs <UID>");
    process.exit(1);
}

async function main() {
    console.log(`\n🔍 Checking User ID: ${uid} in LIVE database...`);

    const roleSnap = await db.collection("user_roles").doc(uid).get();
    const planSnap = await db.collection("user_plans").doc(uid).get();

    console.log("\n--- Firestore Data ---");
    console.log("DB Project ID: aivi-career");

    if (roleSnap.exists) {
        console.log("✅ user_roles found:", roleSnap.data());
    } else {
        console.log("❌ user_roles NOT found for this UID.");
    }

    if (planSnap.exists) {
        console.log("✅ user_plans found:", planSnap.data());
    } else {
        console.log("❌ user_plans NOT found for this UID.");
    }

    process.exit(0);
}

main().catch(console.error);
