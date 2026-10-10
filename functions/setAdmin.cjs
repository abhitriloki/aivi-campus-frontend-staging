#!/usr/bin/env node
"use strict";
/**
 * setAdmin.cjs — Promote a user to admin in the Firestore emulator.
 * Run from the functions/ directory:
 *   node setAdmin.cjs <uid>
 *   node setAdmin.cjs <uid> --plan pro
 */

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const admin = require("firebase-admin");

admin.initializeApp({ projectId: "demo-aivi-career" });
const db = admin.firestore();

const uid = process.argv[2];
const planFlag = process.argv.indexOf("--plan");
const planType = planFlag !== -1 ? process.argv[planFlag + 1] : null;

if (!uid) {
    console.error("Usage: node setAdmin.cjs <uid> [--plan pro|starter|free]");
    process.exit(1);
}

async function main() {
    const now = new Date();
    console.log(`\n🔧 Promoting UID: ${uid}`);

    await db.collection("user_roles").doc(uid).set(
        { userId: uid, role: "admin", updatedAt: now },
        { merge: true }
    );
    console.log("  ✅ user_roles → role: admin");

    if (planType) {
        await db.collection("user_plans").doc(uid).set(
            { userId: uid, planType, plan_type: planType, updatedAt: now },
            { merge: true }
        );
        console.log(`  ✅ user_plans → planType: ${planType}`);
    }

    console.log("\n✔  Done. Sign out and back in for the UI to refresh.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌ Error:", err.message);
    console.error("   Is the Firestore emulator running? (firebase emulators:start)\n");
    process.exit(1);
});
